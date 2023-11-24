const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan')

app.use(cors());
app.use(express.json());

app.use(morgan('dev'));

const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/myDatabase'); // put your own database link here
mongoose.connect('mongodb+srv://mongo:mongo@cluster0.a9q2k5d.mongodb.net/assignment3');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function () {
    console.log("Connection is open...");

    // ! Problem 1: Database Schema
    const EventSchema = mongoose.Schema({
        eventId: {
            type: Number,
            required: [true, "eventId is required"],
            unique: [true, "eventId should be unique"],
        },
        name: {
            type: String,
            required: true,
        },
        loc: {
            type: Number,
            ref: "Location",
        },
        quota: {
            type: Number,
            validate: {
                validator: function (value) {
                    return value > 0;
                },
                message: () => "Please enter a valid quota",
            },
        }
    });

    const Event = mongoose.model("Event", EventSchema);

    const LocationSchema = mongoose.Schema({
        locId: {
            type: Number,
            required: [true, "locId is required"],
            unique: [true, "locId should be unique"],
        },
        name: {
            type: String,
            required: true,
        },
        quota: {
            type: Number,
            validate: {
                validator: function (value) {
                    return value > 0;
                },
                message: () => "Please enter a valid quota",
            },
        }
    });

    const Location = mongoose.model("Location", LocationSchema);

    // let MMW_LT1 = new Location({ locId: 1, name: "MMW LT1", quota: 200 });
    // MMW_LT1
    //     .save()
    //     .then(() => console.log(`Loc added`))
    //     .catch(() => console.log(`MMW LT1 already added`))

    // let csci2720 = new Event({ eventId: 1, name: "CSCI2720", loc: 1, quota: 200 });
    // csci2720
    //     .save()
    //     .then(() => console.log(`Event added`))
    //     .catch(() => console.log(`Event already added`))

    // ! Problem 2: GET
    app.get('/ev/:eventID', (req, res) => {
        console.log({ eventID: req.params.eventID });
        Event.findOne({ eventId: req.params.eventID })
            .then((data) => {
                if (!data) {
                    res.status(404).type('text/plain').send(`Event not found`);
                } else {
                    Location.findOne({ locId: data.loc })
                        .then((locationData) => {
                            if (!locationData) {
                                res.status(404).type('text/plain').send(`Location not found`);
                            } else {
                                let msg = `{<br>
                                    "eventId": ${data.eventId},<br>
                                    "name": "${data.name}",<br>
                                    "loc":<br>
                                    {<br>
                                    "locId": ${locationData.locId},<br>
                                    "name": "${locationData.name}"<br>
                                    },<br>
                                    "quota": ${data.quota}<br>
                                    }`
                                res.status(200).type('text/plain').send(msg);
                            }
                        })
                        .catch((err) => {
                            res.status(500).type('text/plain').send(err);
                        })
                }
            })
            .catch((err) => {
                res.status(500).type('text/plain').send(err);
            })
    });

    // ! Problem 3: POST 
    app.post('/ev', (req, res) => {
        console.log(req.body);
        Location.findOne({ locId: req.body.locId })
            .then((location) => {
                if (!location) {
                    res.status(404).type('text/plain').send(`Location not found`);
                } else {
                    if (location.quota < req.body.quota) {
                        res.status(406).type('text/plain').send(`Invalid quota`);
                    } else {
                        Event.find({}).sort({ eventId: -1 }).limit(1)
                            .then((currMax) => {
                                let eventId = 1;
                                if (currMax.length > 0 && currMax[0].eventId) {
                                    eventId = currMax[0].eventId + 1;
                                }
                                let newEvent = new Event({
                                    eventId: eventId,
                                    name: req.body.name,
                                    loc: req.body.locId,
                                    quota: req.body.quota
                                });
                                newEvent
                                    .save()
                                    .then(() => {
                                        res.status(201).type('text/plain').send("A new event created successfully");
                                    })
                                    .catch((err) => {
                                        res.status(500).type('text/plain').send(err);
                                    });
                            })
                    }
                }
            })
            .catch((err) => {
                res.status(500).type('text/plain').send(err);
            })

    })

    // ! Problem 4: DELETE
    app.delete('/ev/:eventID', (req, res) => {
        console.log({ eventID: req.params.eventID });
        Event.findOneAndDelete({ eventId: req.params.eventID })
            .then((data) => {
                if (!data) {
                    res.status(404).type('text/plain').send(`Event not found`);
                } else {
                    res.status(204).type('text/plain').send();
                }
            })
            .catch((err) => {
                res.status(500).type('text/plain').send(err);
            })
    })

    // ! Problem 5: Some more queries
    // ! Q1: List all the events
    app.get('/ev', (req, res, next) => {
        if (req.query.q) {
            next();
        } else {
            Event.find({})
                .then((data) => {
                    let msg = `[`
                    const promises = data.map((event, index) => {
                        return Location.findOne({ locId: event.loc })
                            .then((locationData) => {
                                if (!locationData) {
                                    throw new Error(`locId ${event.loc} does not exists`)
                                }
                                if (index != 0) {
                                    msg += `,`;
                                }
                                msg += `<br>{<br>
                                    "eventId": ${event.eventId},<br>
                                    "name": "${event.name}",<br>
                                    "loc":<br>
                                    {<br>
                                    "locId": ${locationData.locId},<br>
                                    "name": "${locationData.name}"<br>
                                    },<br>
                                    "quota": ${event.quota}<br>
                                    }<br>`;
                            })
                            .catch((err) => {
                                throw (err);
                            })
                    })
                    Promise.all(promises)
                        .then(() => {
                            msg += `]`;
                            return res.status(200).type('text/plain').send(msg);
                        })
                        .catch((err) => {
                            throw (err);
                        })
                })
                .catch((err) => {
                    res.status(500).type('text/plain').send(err);
                })
        }
    })

    // ! Q2: Show the details for this location ID
    app.get('/lo/:locationID', (req, res) => {
        console.log({ locationID: req.params.locationID });
        Location.findOne({ locId: req.params.locationID })
            .then((data) => {
                if (!data) {
                    res.status(404).type('text/plain').send(`Location not found`);
                } else {
                    let msg = `{<br>
                        "locId": ${data.locId},<br>
                        "name": "${data.name}",<br>
                        "quota": ${data.quota}<br>
                        }`
                    res.status(200).type('text/plain').send(msg);
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(500).type('text/plain').send(err);
            })
    });

    // ! Q3: List all location
    app.get('/lo', (req, res) => {
        Location.find({})
            .then((data) => {
                let msg = `[`
                const promises = data.map((event, index) => {
                    if (index != 0) {
                        msg += `,`;
                    }
                    msg += `<br>{<br>
                        "locId": ${event.locId},<br>
                        "name": "${event.name}"<br>
                        "quota": ${event.quota}<br>
                        }<br>`;

                })
                Promise.all(promises)
                    .then(() => {
                        msg += `]`;
                        return res.status(200).type('text/plain').send(msg);
                    })
                    .catch((err) => {
                        throw (err);
                    })
            })
            .catch((err) => {
                res.status(500).type('text/plain').send(err);
            })
    })

    // ! Q4: List all the events by quota
    app.get('/ev', (req, res) => {
        if (isNaN(req.query.q)) {
            return res.status(500).type('text/plain').send(`Wrong quota number`);
        }
        Event.find({ quota: Number(req.query.q) })
            .then((data) => {
                let msg = `[`
                const promises = data.map((event, index) => {
                    return Location.findOne({ locId: event.loc })
                        .then((locationData) => {
                            if (!locationData) {
                                throw new Error(`locId ${event.loc} does not exists`)
                            }
                            if (index != 0) {
                                msg += `,`;
                            }
                            msg += `<br>{<br>
                                "eventId": ${event.eventId},<br>
                                "name": "${event.name}",<br>
                                "loc":<br>
                                {<br>
                                "locId": ${locationData.locId},<br>
                                "name": "${locationData.name}"<br>
                                },<br>
                                "quota": ${event.quota}<br>
                                }<br>`;
                        })
                        .catch((err) => {
                            throw err;
                        })
                })
                Promise.all(promises)
                    .then(() => {
                        msg += `]`;
                        return res.status(200).type('text/plain').send(msg);
                    })
                    .catch((err) => {
                        throw err;
                    })
            })
            .catch((err) => {
                res.status(500).type('text/plain').send(err);
            })
    })

    // ! Problem 6: Updating with PUT
    app.put('/ev/:eventID', (req, res) => {
        console.log(req.body)
        Event.findOneAndUpdate({ eventId: { $eq: req.params.eventID } }, { $set: req.body }, { new: true })
            .then((data) => {
                Location.findOne({ locId: data.loc })
                    .then((locationData) => {
                        if (!locationData) {
                            res.status(404).type('text/plain').send(`Location not found`);
                        } else {
                            let msg = `{<br>
                                    "eventId": ${data.eventId},<br>
                                    "name": "${data.name}",<br>
                                    "loc":<br>
                                    {<br>
                                    "locId": ${locationData.locId},<br>
                                    "name": "${locationData.name}"<br>
                                    },<br>
                                    "quota": ${data.quota}<br>
                                    }`
                            res.status(200).type('text/plain').send(msg);
                        }
                    })
                    .catch((err) => {
                        res.status(500).type('text/plain').send(err);
                    })
            })
            .catch((err) => {
                res.status(500).type('text/plain').send(err);
            })
    })

    app.all('/*', (req, res) => {
        res.send('Hello World!');
    });

})

const server = app.listen(3000);