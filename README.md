<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.ibb.co.com/BT9ZjqS/home.png" alt="Project logo"></a>
</p>

<h3 align="center">Kontrol Lampu Menggunakan MQTT.js</h3>

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Aplikasi sederhana berbasis web untuk melakukan kontrol terhadap lampu yang dipasang pada Node MCU ESP8266 menggunakan protokol MQTT menggunakan public broker. Project ini dapat dikembangkan lebih dalam misal diintegrasikan dengan aplikasi chat yang sering kita gunakan seperti WhatsApp atau Telegram. Namun saat ini baru bisa melakukan kontrol pada 1 topic dan 1 lampu.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

Project ini berawal dari kegabutan dan melihat adanya bahan yang tidak terpakai, selain itu kemalasan dalam mematikan saklar lampu karena sudah terlanjur rebahan scroll <b>fesnuk</b> pada setiap ingin tidur juga menjadi faktor pendorong untuk membuat project ini.

### Prerequisites

```
1. Node Js
2. Internet
```

### Installing

Clone this project

```
git clone https://github.com/ZumaAkbarID/mqtt-lampu.git
cd mqtt-lampu
```

Install node package

```
npm install
cp .env.example .env
```

Isi .env kemudian
Jalankan server

```
npm start
```

Buka url dibrowser

```
npm install
```

Rangkaian:

<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.ibb.co.com/R2yvHwx/rangkaian.png" alt="Project logo"></a>
 <br>
 Mirip seperti itu tapi menggunakan NodeMCU 1.0 (ESP-12E) dan IN Relay pada D1
</p>

## 🎈 Usage <a name="usage"></a>

Cara penggunaanya cukup sederhana, tinggal colok, lalu jalankan.

## 🚀 Deployment <a name = "deployment"></a>

Tinggal deploy terserah pake docker, panel, pm2, dll.

## ⛏️ Built Using <a name = "built_using"></a>

- [Express](https://expressjs.com/) - Server Framework
- [MQTT.js](https://github.com/mqttjs) - Protocol Client
- [Cron](https://github.com/kelektiv/node-cron) - Scheduling Job
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@ZumaAkbarID](https://github.com/ZumaAkbarID) - Idea & Initial work
