const request = require("request");
const requireLogin = require("../middlewares/requireLogin");
let express = require("express");
let app = express.Router();
const axios = require("axios");
const config = require("../config");
const uuidv4 = require("uuid").v4;
module.exports = (db, usageMiddleware, token) => {
  /* ------------------------------------------------- */
  /* For purchasing Ytel DIDs */
  /* ------------------------------------------------- */
  app.post(
    "/ytel/purchase",
    [requireLogin, usageMiddleware.phoneLimit],
    async (req, res) => {
      const { accessToken } = token.token.data;
      const { number, description, group, state } = req.body;
      var dataString = `{"phoneNumber": ["+${number}"]}`;
      var options = {
        method: "POST",
        url: "https://api-beta.ytel.com/api/v4/number/purchase/",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${accessToken}`,
        },
        body: dataString,
      };
      // var options = {
      //   method: "POST",
      //   url: "https://api.ytel.com/api/v3/incomingphone/buynumber.json",
      //   headers: {
      //     accept: "application/json",
      //     "content-type": "application/x-www-form-urlencoded",
      //     authorization:
      //       "Basic YjMyNzRlZTYtMDJhZS00NTlmLWIzYjAtNGY3OTQzNWRiZjE1OjFmODU4YWIwODc4ZmFkYjE4NjNhNWNkYzliYmY0ZTMw",
      //   },
      //   body: `Did=${number}`,
      // };
      var updateDataString = `{"smsMethod": "POST", "smsUrl":"${config.backendUrl}/message/ytel/receiveSMS", "voiceMethod": "POST", "voiceUrl":"https://customapps.message360.com/m360/examples/welcome/index.php"}`;
      var updateOptions = {
        method: "PUT",
        url: `https://api-beta.ytel.com/api/v4/number/+${number}/`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${accessToken}`,
        },
        body: updateDataString,
      };

      request(options, async (error, response, body) => {
        const jsonBody = JSON.parse(body);
        if (jsonBody.status) {
          if (error) throw new Error(error);
          const did = new db.DID({
            number: "1"+number,
            description,
            _group: group,
            state,
            _user: req.user.id,
            purchaseDate: Date(),
            carrier: "Ytel",
          });
          await did.save();

          let did_details = await axios.get(
            `https://api-beta.ytel.com/api/v4/number/+${number}/`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `bearer ${accessToken}`,
              },
            }
          );
          await db.DID.update(
            {
              voice_enabled: did_details.data.payload[0].attributes.find(
                (attr) => attr === "voice-enabled"
              )
                ? true
                : false,
              sms_enabled: did_details.data.payload[0].attributes.find(
                (attr) => attr === "sms-enabled"
              )
                ? true
                : false,
              mms_enabled: did_details.data.payload[0].attributes.find(
                (attr) => attr === "mms-enabled"
              )
                ? true
                : false,
            },
            { where: { number } }
          );
          const DID_Purchase_Log = new db.Charge_Log({
            number: "1"+number,
            event: "Purchase",
            monthly_cost: req.user.number_rate,
            _user: req.user.id,
            eventDate: Date(),
          });
          await DID_Purchase_Log.save();
          await request(updateOptions, async (error, response, body) => {
            console.log(error);
          });
          if (req.isFreePlan)
            db.User.decrement(
              { complimentary_phone: 1 },
              { where: { id: req.user.id } }
            );
          res.status(200).send("Success");
        }
      });
    }
  );

  /* ------------------------------------------------- */
  /* For looking up user's owned DIDs */
  /* ------------------------------------------------- */
  app.get("/", requireLogin, async (req, res) => {
    const response = await db.DID.findAll({
      where: { _user: req.user.id },
    });
    res.send(response);
  });

  /* ------------------------------------------------- */
  /* For updating user's owned DID */
  /* ------------------------------------------------- */
  app.patch("/", requireLogin, async (req, res) => {
    const { id, description, _group } = req.body;
    const response = await db.DID.update(
      {
        description,
        _group,
        updatedAt: Date(),
      },
      { where: { id } }
    );
    res.send(response);
  });

  /* ------------------------------------------------- */
  /* For updating multiple user's owned DIDs */
  /* ------------------------------------------------- */
  app.patch("/", requireLogin, async (req, res) => {
    const { ids, _group } = req.body;
    const response = await db.DID.updateMany(
      { _id: ids },
      {
        _group,
        updatedAt: Date(),
      },
      { new: true }
    );
    res.send(response);
  });

  /* ------------------------------------------------- */
  /* For releasing user's owned DID */
  /* ------------------------------------------------- */
  app.post(
    "/ytel/release",
    [requireLogin, usageMiddleware.shouldDeleteNumber],
    async (req, res) => {
      const { accessToken } = token.token.data;
      const { number, id } = req.body;
      var dataString = `{"phoneNumber": ["+${number}"]}`;
      var options = {
        method: "POST",
        url: "https://api-beta.ytel.com/api/v4/number/release/",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `bearer ${accessToken}`,
        },
        body: dataString,
      };
      // var options = {
      //   method: "POST",
      //   url: "https://api.ytel.com/api/v3/incomingphone/releasenumber.json",
      //   headers: {
      //     accept: "application/json",
      //     "content-type": "application/x-www-form-urlencoded",
      //     authorization:
      //       "Basic YjMyNzRlZTYtMDJhZS00NTlmLWIzYjAtNGY3OTQzNWRiZjE1OjFmODU4YWIwODc4ZmFkYjE4NjNhNWNkYzliYmY0ZTMw",
      //   },
      //   body: `PhoneNumber=${number}`,
      // };
      request(options, async (error, response, body) => {
        if (error) throw new Error(error);
        const obj = await db.DID.destroy({ where: { id: id } });
        const DID_Purchase_Log = new db.DID_Purchase_Log({
          id: uuidv4(),
          number: "1"+number,
          event: "Release",
          monthly_cost: req.user.number_rate,
          _user: req.user.id,
          eventDate: Date(),
        });
        await DID_Purchase_Log.save();
        res.send({});
      });
    }
  );

  /* ------------------------------------------------- */
  /* For searching for available DIDs in Ytel */
  /* ------------------------------------------------- */
  app.post("/ytel/availablenumber", requireLogin, async (req, res) => {
    const { accessToken } = token.token.data;
    const { searchedAreaCode } = req.body;
    var options = {
      method: "GET",
      url: `https://api-beta.ytel.com/api/v4/number/available/?areaCode=${searchedAreaCode}&offset=0&size=20&type=sms`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${accessToken}`,
      },
    };

    request(options, async (error, response, body) => {
      if (error) throw new Error(error);
      const jsonBody = JSON.parse(body);
      // console.log("jsonBody", jsonBody)
      if (jsonBody && jsonBody.status) {
        res.send(jsonBody);
      } else {
        res.send(null);
      }
    });
  });

  /* ------------------------------------------------- */
  /* For user to search for number using Questblue */
  /* ------------------------------------------------- */
  app.post(
    "/questblue/listAvailableDids",
    [requireLogin, usageMiddleware.phoneLimit],
    async (req, res) => {
      const { searchedAreaCode } = req.body;
      var headers = {
        "Content-type": "application/json",
        "Security-Key": config.questBluekey,
        Authorization:
          "Basic " +
          new Buffer("harkirat" + ":" + "123random").toString("base64"),
      };
      var dataString = `{"type": "local", "tier":"1b", "state":"NC", "npa": ${searchedAreaCode}}`;

      var options = {
        url: "https://api2.questblue.com/did/available",
        method: "GET",
        headers: headers,
        body: dataString,
      };
      request(options, async (error, response, body) => {
        console.log(error);
        console.log(body);

        if (error) throw new Error(error);
        try {
          const jsonBody = JSON.parse(body);
          if (jsonBody && jsonBody.data) {
            res.send(jsonBody.data);
          } else {
            res.send(null);
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
  );

  /* ------------------------------------------------- */
  /* For user to order number with Questblue */
  /* ------------------------------------------------- */
  app.post("/questblue/purchase", requireLogin, async (req, res) => {
    const { number, description, group, carrier, state } = req.body;
    var headers = {
      "Content-type": "application/json",
      "Security-Key": config.questBluekey,
      Authorization:
        "Basic " +
        new Buffer("harkirat" + ":" + "123random").toString("base64"),
    };

    var dataString = `{"tier":"1b", "did": ${number}, "route2trunk": null, "cnam": null, "note": null, "e911": null}`;
    var options = {
      method: "POST",
      url: "https://api2.questblue.com/did",
      headers: headers,
      body: dataString,
    };
    var updateDataString = `{"did": ${number}, "sms_mode": "url", "forward2email": null, "xmpp_name" : null, "xmpp_passwd" : null, "post2urlmethod" : "form", "post2url": "${config.backendUrl}/message/questblue/receiveSMS"}`;
    var updateOptions = {
      method: "PUT",
      url: "https://api2.questblue.com/sms",
      headers: headers,
      body: updateDataString,
    };

    request(options, async (error, response, body) => {
      if (error) throw new Error(error);
      const did = new db.DID({
        number: "1"+number,
        description,
        _group: group,
        state,
        _user: req.user.id,
        voice_enabled: true,
        sms_enabled: true,
        mms_enabled: true,
        carrier,
        // purchaseDate: Date(),
      });
      await did.save();

      const DID_Purchase_Log = new db.Charge_Log({
        number: "1"+number,
        event: "Purchase",
        monthly_cost: req.user.number_rate,
        _user: req.user.id,
        eventDate: Date(),
      });
      await DID_Purchase_Log.save();
      await request(updateOptions, (a, b, c) => {});
      res.status(200).send("Success");
    });
  });

  /* ------------------------------------------------- */
  /* For user to update owned Questblue number   NOT SURE IF THIS IS BEING USED*/ 
  /* ------------------------------------------------- */
  app.post("/questblue/updateDid", requireLogin, async (req, res) => {
    const { DID, group_id } = req.body;
    var headers = {
      "Content-type": "application/json",
      "Security-Key": config.questBluekey,
      Authorization:
        "Basic " + new Buffer("augurs" + ":" + "Augurs@123").toString("base64"),
    };
    var dataString = `{"did": ${DID}, "note" : "New Note", "pin": "null", "route2trunk": "null", "forw2did": "null", "failover": "null", "lidb": "null", "cnam": "null", "e911": "null"}`;
    var options = {
      method: "PUT",
      url: "https://api2.questblue.com/did",
      headers: headers,
      body: dataString,
    };
    request(options, async (error, response, body) => {
      if (error) throw new Error(error);
      res.send(body);
    });
  });

  /* ------------------------------------------------- */
  /* For user to release owned Questblue number */
  /* ------------------------------------------------- */
  app.post(
    "/questblue/release",
    [requireLogin, usageMiddleware.shouldDeleteNumber],
    async (req, res) => {
      const { number, id } = req.body;
      var headers = {
        "Content-type": "application/json",
        "Security-Key": config.questBluekey,
        Authorization:
          "Basic " +
          new Buffer("augurs" + ":" + "Augurs@123").toString("base64"),
      };
      var dataString = `{"did": ${number}}`;
      var options = {
        method: "DELETE",
        url: "https://api2.questblue.com/did",
        headers: headers,
        body: dataString,
      };
      request(options, async (error, response, body) => {
        if (error) throw new Error(error);
        await db.DID.destroy({ where: { id } });

        const DID_Purchase_Log = new db.Charge_Log({
          number: "1"+number,
          event: "Release",
          monthly_cost: req.user.number_rate,
          _user: req.user.id,
          eventDate: Date(),
        });
        await DID_Purchase_Log.save();
        res.send({});
      });
    }
  );

  /* ------------------------------------------------- */
  /* For user to send SMS with Questblue number */
  /* ------------------------------------------------- */
  app.post("/questblue/sendsms", requireLogin, async (req, res) => {
    const { number, external_number, message } = req.body;
    var headers = {
      "Content-type": "application/json",
      "Security-Key": config.questBluekey,
      Authorization:
        "Basic " + new Buffer("augurs" + ":" + "Augurs@123").toString("base64"),
    };
    var dataString = `{"did": ${number}, "did_to": ${external_number}, "msg": ${message}, "file": "null", "fname": "null"}`;
    var options = {
      method: "POST",
      url: "https://api2.questblue.com/sms",
      headers: headers,
      body: dataString,
    };
    request(options, async (error, response, body) => {
      if (error) throw new Error(error);
      res.send(body);
    });
  });
  return app;
};
