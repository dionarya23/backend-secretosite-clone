module.exports = function(mongoose) {
    mongoose.createConnection(process.env.MONGODB_URL);
}