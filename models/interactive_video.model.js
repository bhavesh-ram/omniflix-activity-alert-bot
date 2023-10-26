var mongoose = require('mongoose');

const interactiveVideoSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    asset: {
        type: String
    },
    nft: {
        type: String,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
    video_thumbnail: {
        type: String,
    },
    duration: {
        type: Number,
    },
    participations: {
        type: Number,
    },
    participants_count: {
        type: Number,
    },
    participated: {
        type: Boolean,
    },
    total_interactions: {
        type: Number,
    },
    interactions_count: {
        type: Number,
    },
    tags: {
        type: Array,
    },
    publish_settings: {
        type:  Object,
    },
    publish_status: {
        type: Object,
    },
    interactions: {
        type: Array,
    },
    interaction_nft: {
        type: String,
    },
    created_by: {
        type: String
    },
    start_time: {
        type: Date,
    },
    end_time: {
        type: Date,
    },
    status: {
        type: String,
    },
    config: {
        type: Object,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
    isNotified: {
        type: Boolean,
        default: false,
    }
});

var interactiveVideoData = mongoose.model('interactive_video', interactiveVideoSchema);

module.exports = {
    interactiveVideoData,
};