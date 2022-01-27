//express.js
const express = require("express");
const cors = require('cors');
const app = express();
const port = 8080;

/* MySql 연결 */
const mysql = require("mysql");
const fs = require("fs");  //파일관리 모듈
const dataJson = fs.readFileSync("./database.json");
const parseData = JSON.parse(dataJson);

const connection = mysql.createConnection({
    host: parseData.host,
    user: parseData.user,
    password: parseData.password,
    port: parseData.port,
    database: parseData.database
});
/* MySql 연결 끝 */

app.use(express.json());  //json 형식의 데이터를 처리할 수 있게 설정하는 코드
app.use(cors());  //브라우저의 CORS 이슈를 막기 위해 사용하는 코드


//커피 전체 조회 - GET
app.get('/coffee', async (req, res) => {
    connection.query(
        "SELECT * FROM coffee",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

//공지사항 전체 조회 - GET
app.get('/notice', async (req, res) => {
    connection.query(
        `SELECT * FROM notice
         
        `,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

//공지사항 등록 - POST
app.post("/notice/upload", async (req, res) => {
    res.send('공지사항이 등록되었습니다.')
});

//이벤트 전체 조회 - GET
app.get('/event', async (req, res) => {
    connection.query(
        "SELECT * FROM event",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

//이벤트 등록 - POST
app.post("/event/upload", async (req, res) => {
    res.send('공지사항이 등록되었습니다.')
});


////////////////////////////////////////////////////////////////////////////
//세팅한 app을 실행시킨다.
app.listen(port, () => {
    console.log('Gabes Coffee 서버가 돌아가고 있습니다.');
});