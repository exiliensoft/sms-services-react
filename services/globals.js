const redis = require("redis");
const socketIO = require("socket.io");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _initSubscriber = function (subscriber, io) {
  subscriber.subscribe("RECEIVE_MESSAGE");
  subscriber.subscribe("RECEIVE_CLOSE_COVERSATION_STATUS");
  subscriber.subscribe("RECEIVE_MESSAGE_STATUS");
  subscriber.subscribe("UPDATE_CONVERSATION");
  subscriber.subscribe("CREATE_CONVERSATION");
  subscriber.subscribe("ROUTE_CONVERSATION");

  subscriber.on("message", function (channel, data) {
    data = JSON.parse(data);
    console.log(channel);
    switch (channel) {
      case "RECEIVE_MESSAGE":
        return io.to(data.room).emit("RECEIVE_MESSAGE", data);
      case "RECEIVE_CLOSE_COVERSATION_STATUS":
        return io.to(data.room).emit("RECEIVE_MESSAGE", data);
      case "UPDATE_CONVERSATION":
        return io.to(data.room).emit("UPDATE_CONVERSATION", data);
      case "CREATE_CONVERSATION":
        return io.to(data.room).emit("CREATE_CONVERSATION", data);
      case "ROUTE_CONVERSATION":
        return io.to(data.room).emit("ROUTE_CONVERSATION", data);
      case "RECEIVE_MESSAGE_STATUS":
        return io.emit("RECEIVE_MESSAGE_STATUS", data);
    }
  });
};
const _initIo = function (io, db, publisher) {
  io.on("connection", (socket) => {
    socket.on("SEND_MESSAGE", function (data) {
      publisher.publish("RECEIVE_MESSAGE", JSON.stringify(data));
    });
    socket.on("join", async ({ id, email }) => {
      if (!id || !email) {
        return;
      }
      const ownGroups = await db.Group.findAll({
        where: { _user: id },
      });
      const memberGroups = await db.Member.findAll({
        where: {
          _user_email: email,
        },
      });
      ownGroups.map(({ id }) => {
        socket.join(id);
      });
      memberGroups.map(({ _group }) => {
        socket.join(_group);
      });
    });
  });
};

module.exports = (server, db) => {
  let plans = null;
  const subscriber = redis.createClient();
  const publisher = redis.createClient();
  let io = socketIO(server);
  _initSubscriber(subscriber, io);
  _initIo(io, db, publisher);
  return {
    getPlans: async () => {
      if (plans) {
        return plans;
      }
      let sms_plan = await db.SMS_Plan.findAll({});
      let voice_plan = await db.Voice_Plan.findAll({ where: {} });
      let did_plan = await db.DID_Plan.findAll({});
      plans = { sms_plan, voice_plan, did_plan };
      return plans;
    },
    getDidCount: async (id) => {
      const did_count = await db.DID.count({
        where: {
          _user: id,
        },
      });
      return did_count;
    },
    publisher,
    io,
  };
};
