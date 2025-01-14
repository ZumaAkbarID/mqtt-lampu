require('dotenv').config();
const express = require('express');
const path = require('path');
const { CronJob } = require('cron');
const fs = require('fs');
const mqtt = require("mqtt");
let mqttClient = mqtt.connect(`mqtt://${process.env.BROKER_MQTT || 'test.mosquitto.org'}`);

const app = express();
const PORT = process.env.PORT || 3000;

const SCHEDULE_FILE = path.join(process.cwd(), 'schedule', 'schedule.json');

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

let lampOnSchedule = null;
let lampOffSchedule = null;

function publishToBroker(lampStatus) {
  let result = false;
  mqttClient.publish(process.env.TOPIC || 'testtopic', lampStatus.toUpperCase(), function (error) {
    if (error) {
      console.log("MQTT ERROR: " + error);
      result = false;
    } else {
      saveScheduleToFile(lampStatus.toUpperCase(), lampOnSchedule !== null ? lampOnSchedule.cronTime.source : null, lampOffSchedule !== null ? lampOffSchedule.cronTime.source : null);
      result = true;
    }
  })

  return result;
}

function saveScheduleToFile(lampStatus, cronOn, cronOff) {
  const scheduleData = {
    lampStatus: lampStatus,
    lampOnSchedule: cronOn ? cronOn : null,
    lampOffSchedule: cronOff ? cronOff : null,
  };

  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(scheduleData, null, 2));
}

function loadScheduleFromFile() {
  if (fs.existsSync(SCHEDULE_FILE)) {
    const scheduleData = JSON.parse(fs.readFileSync(SCHEDULE_FILE));

    if (scheduleData.lampOnSchedule) {
      lampOnSchedule = new CronJob(
        scheduleData.lampOnSchedule,
        () => {
          publishToBroker("ON");
          console.log(`Scheduled on task executed: ${scheduleData.lampOnSchedule}`);
        },
        null,
        true,
        'Asia/Jakarta'
      );
    }

    if (scheduleData.lampOffSchedule) {
      lampOffSchedule = new CronJob(
        scheduleData.lampOffSchedule,
        () => {
          publishToBroker("OFF");
          console.log(`Scheduled off task executed: ${scheduleData.lampOffSchedule}`);
        },
        null,
        true,
        'Asia/Jakarta'
      );
    }
  }
}

app.post('/set-schedule', (req, res) => {
  const { aturManual, lampStatus, cronTimeOn, cronTimeOff } = req.body;

  if (!lampStatus || (lampStatus !== 'on' && lampStatus !== 'off')) {
    return res.status(400).json({ error: 'invalid request lampStatus' });
  }

  if (publishToBroker(lampStatus.toUpperCase())) {
    if (aturManual) {
      if (lampOffSchedule) {
        lampOffSchedule.stop();
        console.log('Previous off job stopped');
      }

      if (lampOnSchedule) {
        lampOnSchedule.stop();
        console.log('Previous on job stopped');
      }

      lampOffSchedule = new CronJob(
        cronTimeOff,
        () => {
          publishToBroker("OFF");
          console.log(`Scheduled off task executed: ${cronTimeOff}`);
        },
        null,
        true,
        'Asia/Jakarta'
      );

      lampOnSchedule = new CronJob(
        cronTimeOn,
        () => {
          publishToBroker("ON");
          console.log(`Scheduled on task executed: ${cronTimeOn}`);
        },
        null,
        true,
        'Asia/Jakarta'
      );

      saveScheduleToFile(lampStatus, cronTimeOn, cronTimeOff);
    } else {
      if (lampOffSchedule) {
        lampOffSchedule.stop();
        console.log('Previous off job stopped');
      }

      if (lampOnSchedule) {
        lampOnSchedule.stop();
        console.log('Previous on job stopped');
      }

      saveScheduleToFile(lampStatus, "", "");
    }
  } else {
    return res.status(503).json({ error: 'mqtt error' });
  }

  res.json({ success: true, message: 'Job scheduled successfully' });
});

app.post('/set-lamp', (req, res) => {
  const { lampStatus } = req.body;

  if (!lampStatus || (lampStatus !== 'on' && lampStatus !== 'off')) {
    return res.status(400).json({ error: 'invalid request lampStatus' });
  }

  if (publishToBroker(lampStatus.toUpperCase())) {
    saveScheduleToFile(lampStatus, lampOnSchedule !== null ? lampOnSchedule.cronTime.source : null, lampOffSchedule !== null ? lampOffSchedule.cronTime.source : null);
  } else {
    return res.status(503).json({ error: 'mqtt error' });
  }

  res.json({ success: true, message: 'Set lamp successfully' });
});

app.get('/get-schedule', (req, res) => {
  if (fs.existsSync(SCHEDULE_FILE)) {
    const scheduleData = JSON.parse(fs.readFileSync(SCHEDULE_FILE));
    res.json(scheduleData);
  } else {
    res.json({
      lampStatus: null,
      lampOnSchedule: null,
      lampOffSchedule: null
    });
  }
});

loadScheduleFromFile();

mqttClient.on('connect', function (connack) {
  console.log('MQTT: Connected')
})

mqttClient.on('reconnect', function (connack) {
  console.log('MQTT: Reconnecting...')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`MQTT Broker: ${process.env.BROKER_MQTT}`);
  console.log(`MQTT Topic: ${process.env.TOPIC}`);
});