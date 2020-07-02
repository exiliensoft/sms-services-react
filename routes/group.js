const uuidv4 = require("uuid").v4;
const requireLogin = require("../middlewares/requireLogin");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
let express = require("express");
let app = express.Router();

module.exports = (db) => {
  /* ------------------------------------------------- */
  /* For user to create new Group */
  /* ------------------------------------------------- */
  app.post("/", requireLogin, async (req, res) => {
    const {
      group_name,
      group_description,
      addedMembers,
      newGroupDIDReRoute,
      selected_fields,
      checked_fields,
    } = req.body;
    const group = await db.Group.create({
      status: "Active",
      group_name,
      group_description,
      owner: `${req.user.given_name} ${req.user.family_name}`,
      _user: req.user.id,
      updatedAt: Date(),
      createdAt: Date(),
      fields: selected_fields,
      checked_fields,
    });
    await db.DID.update(
      { _group: group.id },
      { where: { id: newGroupDIDReRoute } }
    );
    // await db.Field.bulkCreate(
    //   fields.map((field) => {
    //     return {
    //       id: uuidv4(),
    //       _user: req.user.id,
    //       type: 1,
    //       fieldName: field,
    //     };
    //   })
    // );
    await db.Member.bulkCreate(
      addedMembers.map((member) => {
        return {
          id: uuidv4(),
          _user_email: member,
          _group: group.id,
          status: 0,
        };
      })
    );
    res.send(group);
  });

  app.post("/accept", requireLogin, async (req, res) => {
    await db.Member.update(
      {
        status: 1,
      },
      {
        where: {
          _group: req.body.id,
          _user_email: req.user.email,
        },
      }
    );
    return res.json({});
  });

  app.post("/reject", requireLogin, async (req, res) => {
    console.log(req.body);
    await db.Member.update(
      {
        status: 2,
      },
      {
        where: {
          _group: req.body.id,
          _user_email: req.user.email,
        },
      }
    );
    return res.json({});
  });

  /* ------------------------------------------------- */
  /* For fetching all Groups */
  /* ------------------------------------------------- */
  app.get("/", requireLogin, async (req, res) => {
    let ownGroup = await db.Group.findAll({
      where: { _user: req.user.id },
      include: [{ model: db.Member, include: [db.User] }, { model: db.User }],
    });

    const membersMappings = await db.Member.findAll({
      where: {
        _user_email: req.user.email,
      },
    });

    let memberGroup = [];
    if (membersMappings.length !== 0) {
      memberGroup = await db.Group.findAll({
        where: {
          id: membersMappings.map(
            (membersMapping) => membersMapping._group
          ),
        },
        include: [{ model: db.Member, include: [db.User] }, { model: db.User }],
      });
    }
    let fieldValues = await db.Field.findAll({
      where: {
        //TODO: Add where
        id: [].concat(
          ...[
            ...memberGroup.map((mg) => mg.dataValues.fields),
            ...ownGroup.map((mg) => mg.dataValues.fields),
          ]
        ),
      },
    });
    let fields = {};
    fieldValues.map((f) => (fields[f.id] = f));
    ownGroup = ownGroup.map((og) => {
      let groupFields = og.fields
        .map((field) => fields[field])
        .filter((field) => field != null);
      return {
        ...og.dataValues,
        fieldData: groupFields,
      };
    });
    memberGroup = memberGroup.map((og) => {
      let groupFields = og.fields
        .map((field) => fields[field])
        .filter((field) => field != null);
      return {
        ...og.dataValues,
        fieldData: groupFields,
      };
    });
    const response = { owned_groups: ownGroup, member_groups: memberGroup };

    res.send(response);
  });

  /* ------------------------------------------------- */
  /* For updating Group */
  /* ------------------------------------------------- */
  app.patch("/", requireLogin, async (req, res) => {
    const {
      group_id,
      group_name,
      group_description,
      addedMembers,
      deletedMembers,
      modifiedUncheckedDIDGroup,
      newGroupDIDReRoute,
      fields,
      checked_fields,
    } = req.body;

    const response = await db.Group.update(
      {
        status: "Active",
        group_name,
        group_description,
        // owner: `${req.user.given_name} ${req.user.family_name}`,
        _user: req.user.id,
        updatedAt: Date(),
        fields,
        checked_fields,
      },
      { where: { id: group_id } }
    );

    await db.DID.update(
      { _group: null },
      { where: { id: modifiedUncheckedDIDGroup } }
    );

    await db.DID.update(
      { _group: group_id },
      { where: { id: newGroupDIDReRoute } }
    );

    console.log("addedMembers", addedMembers)
    await db.Member.bulkCreate(
      addedMembers.map((member) => {
        console.log("member", member)
        return {
          id: uuidv4(),
          _user_email: member,
          _group: group_id,
          status: 0,
          queue_name: group_name,
          interface: null,
          // membername: ""
          state_interface: null,
          penalty: null,
          paused: null,
          uniqueid: 1000
        };
      })
    );
    await db.Member.destroy({
      where: {
        _group: group_id,
        _user_email: deletedMembers,
      },
    });

    res.send(response);
  });

  /* ------------------------------------------------- */
  /* For deleteing Groups? */
  /* ------------------------------------------------- */
  app.delete("/", requireLogin, async (req, res) => {});

  /* ------------------------------------------------- */
  /* For deleting Group */
  /* ------------------------------------------------- */
  app.delete("/:groupId", requireLogin, async (req, res) => {
    const response = await db.Group.destroy({
      where: { id: req.params.groupId },
    });

    const phone_req = await db.DID.update(
      { $set: { _group: null } },
      { where: { _group: { $in: req.params.groupId } } }
    );

    res.send({});
  });

  /* -------------------------------------------------------------- */
  /* For fetching all the emails with the same company domain */
  /* -------------------------------------------------------------- */
  app.post("/domain", requireLogin, async (req, res) => {
    const { email } = req.user;
    let userDomain = email.split("@")[1].split(".")[0];

    let commonDomains = [
      "aol",
      "att",
      "comcast",
      "facebook",
      "gmx",
      "googlemail",
      "google",
      "hotmail",
      "mac",
      "me",
      "mail",
      "msn",
      "live",
      "sbcglobal",
      "verizon",
      "yahoo",
      "email",
      "fastmail",
      "games",
      "hush",
      "hushmail",
      "icloud",
      "iname",
      "inbox",
      "lavabit",
      "love",
      "outlook",
      "pobox",
      "protonmail",
      "tutanota",
      "tutamail",
      "tuta",
      "keemail",
      "rocketmail",
      "safe-mail",
      "wow",
      "ygm",
      "ymail",
      "zoho",
      "yandex",
      "bellsouth",
      "charter",
      "cox",
      "earthlink",
      "juno",
      "btinternet",
      "virginmedia",
      "blueyonder",
      "freeserve",
      "ntlworld",
      "o2",
      "orange",
      "sky",
      "talktalk",
      "tiscali",
      "virgin",
      "wanadoo",
      "bt",
      "sina",
      "qq",
      "naver",
      "hanmail",
      "daum",
      "nate",
      "163",
      "yeah",
      "126",
      "21cn",
      "aliyun",
      "foxmail",
      "laposte",
      "sfr",
      "neuf",
      "free",
      "online",
      "t-online",
      "web",
      "libero",
      "virgilio",
      "alice",
      "tin",
      "poste",
      "teletu",
      "rambler",
      "ya",
      "list",
      "skynet",
      "voo",
      "tvcablenet",
      "telenet",
      "fibertel",
      "speedy",
      "arnet",
      "prodigy",
      "bell",
      "shaw",
      "sympatico",
      "rogers",
      "uol",
      "bol",
      "terra",
      "ig",
      "itelefonica",
      "r7",
      "zipmail",
      "globo",
      "globomail",
      "oi",
    ];

    if (commonDomains.filter((domain) => domain === userDomain)[0]) {
      return null;
    }

    let response = await db.User.findAll({
      where: { email: { [Op.like]: "%" + userDomain + "%" } },
    });

    /* await response.map(user => {
       let name = user.dataValues.given_name + " " + user.dataValues.family_name
       sameDomainUsers[name] = user.dataValues.email
     })*/

    res.send(response.map((res) => res.email));
  });

  return app;
};
