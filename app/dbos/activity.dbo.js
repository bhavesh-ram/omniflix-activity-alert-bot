const Activity = require('../models/activity.model');

const populatePaths = [];

const save = (_doc, populate, cb) => {
    const doc = new Activity(_doc);
    doc.save((error) => {
        if (error) {
            cb(error);
        } else if (populate) {
            Activity.populate(doc, populatePaths, cb);
        } else {
            cb(null, doc);
        }
    });
};

const findOne = (conditions, projections, options, populate, cb) => {
    let doc = Activity.findOne(conditions, projections, options).lean();
    if (populate) {
        doc = doc.populate(populatePaths);
    }

    doc.exec({}, cb);
};

const find = (conditions, projections, options, populate, cb) => {
    let doc = Activity.find(conditions, projections, options).lean();
    if (populate) {
        doc = doc.populate(populatePaths);
    }

    doc.exec({}, cb);
};

const findOneAndUpdate = (conditions, update, options, populate, cb) => {
    let doc = Activity.findOneAndUpdate(conditions, update, options).lean();
    if (populate) {
        doc = doc.populate(populatePaths);
    }

    doc.exec({}, cb);
};

const findOneAndDelete = (conditions, options, populate, cb) => {
    let doc = Activity.findOneAndDelete(conditions, options).lean();
    if (populate) {
        doc = doc.populate(populatePaths);
    }

    doc.exec({}, cb);
};

const aggregate = (pipeline, cb) => {
    Activity.aggregate(pipeline).exec(cb);
};

const count = (conditions, cb) => {
    Activity.countDocuments(conditions).exec(cb);
};

const updateMany = (conditions, update, cb) => {
    Activity.updateMany(conditions, update).exec(cb);
};

module.exports = {
    save,
    findOne,
    find,
    findOneAndUpdate,
    findOneAndDelete,
    aggregate,
    count,
    updateMany
};
