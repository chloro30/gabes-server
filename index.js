//express.js
const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

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



//회원 등록 - POST
app.post("/member/register", async (req, res) => {

    // const request = req.body;
    // console.log(request);

    const {m_id, m_password, m_name, m_phone, m_birthday, m_gender, m_address} = req.body;

    connection.query(
        `
        INSERT INTO member (id, pwd, name, phone, birthday, gender, address, register_date)
        VALUES (?,?,?,?,?,?,?, DATE_ADD(NOW(), INTERVAL 9 HOUR))
        `,
        [m_id, m_password, m_name, m_phone, m_birthday, m_gender, m_address],
        (err, result, fields) => {
            if(err){
                console.log(`에러 : ${err}`);
            }
            res.send(result);
        }
    );
});

//회원 한 명 정보 조회 - POST
app.post("/member", async (req, res) => {

    // const request = req.body;
    // console.log(request);

    const {userId} = req.body;
    // console.log(userId);

    connection.query(
        `
        SELECT * FROM member
        WHERE id = ?
        `,
        [userId],
        (err, result, fields) => {
            if(err){
                console.log(`에러 : ${err}`);
            }
            res.send(result);
        }
    );
});

//(로그인)회원 조회 - POST
app.post("/login/:id/:pwd", async (req, res) => {

    // const request = req.body;
    // console.log(request);

    const {userId, userPwd} = req.body;
    // console.log(userId, userPwd);

    connection.query(
        `
        SELECT * FROM member
        WHERE id = ? AND pwd = ?
        `,
        [userId, userPwd],
        (err, result, fields) => {
            if(err){
                console.log(`에러 : ${err}`);
            }
            res.send(result);
        }
    );
});


//커피 전체 조회 - GET
app.get('/menu/coffee', async (req, res) => {
    const SeoulDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul'
    });
    console.log(`coffee 조회: ${SeoulDate}`);

    connection.query(
        "SELECT * FROM coffee",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

//디저트 전체 조회 - GET
app.get('/menu/desert', async (req, res) => {
    const SeoulDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul'
    });
    console.log(`desert 조회: ${SeoulDate}`);

    connection.query(
        "SELECT * FROM desert",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});



//공지사항 전체 조회 - GET
app.get('/board/notice', async (req, res) => {
    const SeoulDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul'
    });
    console.log(`공지사항 전체 조회: ${SeoulDate}`);
    connection.query(
        `
        SELECT * FROM notice
        `,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});


//공지사항 상세 조회 - GET
app.get('/board/notice/:no', async (req, res) => {
    const SeoulDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul'
    });
    console.log(`공지사항 상세 조회: ${SeoulDate}`);
    
    const {no} = req.params;
    console.log(`글 번호: ${no}`);
    
    connection.query(
        `
        SELECT * FROM notice
        WHERE no = ${no}
        `,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});
    
//공지사항 10개만 조회 - GET
app.get('/board/notice/limit/:count', async (req, res) => {
    const {count} = req.params;
    // console.log(count);
    // console.log(req.params);

    const startNum = (10*(count-1));
    console.log(startNum);

    // LIMIT 의 두번째 인자와 client의 limit 변수가 일치 해야한다.
    connection.query(
        `
        SELECT * FROM notice
        ORDER BY no DESC
        LIMIT ${startNum}, 10
        `,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});


//공지사항 등록 - POST
app.post("/board/notice/upload", async (req, res) => {

    // const request = req.body;
    // console.log(request);

    const {title, desc, writer, date} = req.body;

    connection.query(
        `
        INSERT INTO notice (title, description, writer, date)
        VALUES (?,?,?,?)
        `,
        [title, desc, writer, date],
        (err, result, fields) => {
            console.log(err);
            res.send(result);
        }
    );
        
    console.log(`공지사항 등록: ${date}`);
});


//공지사항 수정 - PUT
app.put("/board/notice/update/:no", async (req, res) => {

    const {no} = req.params;
    // console.log(`수정수정수정: ${no}`);

    const {title, desc} = req.body;

    console.log(no, title, desc);

    connection.query(
        `
        UPDATE notice
        SET title = ?,
            description = ?
        WHERE no = ?
        `,
        [title, desc, no],
        (err, result, fields) => {
            res.send(result);
            // res.send('1');
        }
    );
        
    const SeoulDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul'
    });
    console.log(`공지사항 수정: ${SeoulDate}`);
});

//공지사항 삭제 - DELETE
app.delete("/board/notice/delete/:no", async (req, res) => {

    const {no} = req.params;
    console.log(no);

    connection.query(
        `
        DELETE FROM notice
        WHERE no = ${no}
        `,
        (err, result, fields) => {
            res.send(result);
        }
    );
        
    const SeoulDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul'
    });
    console.log(`공지사항 삭제: ${SeoulDate}`);
});








//이벤트 전체 조회 - GET
app.get('/board/event', async (req, res) => {
    connection.query(
        "SELECT * FROM event",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

//이벤트 등록 - POST
app.post("/board/event/upload", async (req, res) => {
    res.send('공지사항이 등록되었습니다.')
});




////////////////////////////////////////////////////////////////////////////
//세팅한 app을 실행시킨다.
app.listen(port, () => {
    
    // 서울 시간대 사용하려면 다음과 같이 생성해서 사용
    const SeoulDate = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul'
    });
    console.log(`서버가 돌아가고 있습니다. (${SeoulDate})`);
});