var HttpClient = require('./HttpClient');
const { Op } = require("sequelize");
const { GraphQLClient } = require('graphql-request');
const StudentModel = require("../model/studentmodel");
const MappingModel = require("../model/mappingmodel");
var HomeworkModel = require("../model/homeworkmodel")
var HomeworkStudentModel = require("../model/homeworkstudentmodel");
const TeacherStudentModel = require('../model/teacherstudentmodel');

class StudentLogic
{

    static getGraphClient()
    {
        let headers = {
            'Content-Type': 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEwNTc3NTg2OCwidWlkIjoxMjE0NTQ1NywiaWFkIjoiMjAyMS0wNC0wOFQwNToxNjo0Mi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjQ4MTQ1NywicmduIjoidXNlMSJ9.hFUZN6fnpionJ7Pka1VqHqJNj2sDhkN9P57_UJPFKtA'
        };

        //Create connection called 'client' that connects to Monday.com's API
        const client = new GraphQLClient('https://api.monday.com/v2', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEwNTc3NTg2OCwidWlkIjoxMjE0NTQ1NywiaWFkIjoiMjAyMS0wNC0wOFQwNToxNjo0Mi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjQ4MTQ1NywicmduIjoidXNlMSJ9.hFUZN6fnpionJ7Pka1VqHqJNj2sDhkN9P57_UJPFKtA'
            },
        });
        return client;
    }

    static sendGraph(query)
    {
        let promise = new Promise((resolve, reject)=>{
            let client = this.getGraphClient();
            client.request(query).then((response)=>{
                console.log("=============Query=============")
                console.log(query);
                console.log("Response")
                console.log( JSON.stringify( response));
                console.log("=================")

                resolve(response);
            }).catch((err)=>{
                reject(err);
            })
        })

        return promise;
    }

    static async getItem(itemId)
    {
        let promise = new Promise((resolve, reject)=>{
            let query = "{" +
            "items(ids:[" + itemId + "]) {" +
            "  id " +
            "  name " +
            "  column_values " +
            "  { " +
            "      id " +
            "        title " +
            "        text " +
            "      value " +
            "  } " +
            "  board { " +
            "    id " +
            "  } " +
            "  creator { " +
            "    id " +
            "  } " +
            " } " +
            "}";

        
            this.sendGraph(query).then((response)=>{
                var item = response.items[0];
                resolve(item);
            }).catch(err=>{ 
                
                console.log(err);
                reject(err);
            })
        })

        return promise;
    }

    static async getItemByName(name)
    {
        let promise = new Promise((resolve, reject)=>{
            let query = "{" +
            "items(ids:[" + itemId + "]) {" +
            "  id " +
            "  name " +
            "  column_values " +
            "  { " +
            "      id " +
            "        title " +
            "        text " +
            "      value " +
            "  } " +
            "  board { " +
            "    id " +
            "  } " +
            "  creator { " +
            "    id " +
            "  } " +
            " } " +
            "}";

        
            this.sendGraph(query).then((response)=>{
                var item = response.items[0];
                resolve(item);
            }).catch(err=>{ 
                
                console.log(err);
                reject(err);
            })
        })

        return promise;
    }

    static async getBoard(boardId)
    {

    }

    static async getStudents()
    {
        try{
            var students =  await StudentModel.findAll();
            return students;
        }
        catch (e)
        {
            throw e;
        }
       
    }

    static async getBoardGroup(boardId, groupId)
    {
        let promise = new Promise((resolve, reject) => {
            let query = "{ " +
            "boards(ids: " + boardId + ") { " +
            "  groups(ids: " + groupId + ") { " +
            "    id " +
            "    title " +
            "    items {" +
            "       id " +
            "       name " +
            "     } " +
            "  } " +
            "} " +
            "}";



            this.sendGraph(query).then((response)=>{
                console.log("Groups")
                console.log(response);  
                
                var boards = response.boards;
                var board = boards[0];
                var groups = board.groups;
                resolve(groups[0]);
                
            }).catch((e) => {
                reject(e);
            })
        })

        return promise;        
    }

    static async getBoardGroupByTitle(boardID, title)
    {
        let promise = new Promise((resolve, reject) => {
            let query = "{ " +
            "boards(ids: " + boardID + ") { " +
            "  groups() { " +
            "    id " +
            "    title " +
            //"    items {" +
            //"       id " +
            //"       name " +
            //"    } " +
            "  } " +
            "} " +
            "}";

            //console.log(query);

            this.sendGraph(query).then((response)=>{
                
                var boards = response.boards;
                var board = boards[0];
                var groups = board.groups;
                groups.forEach((group) =>{
                    if(group.title.toLowerCase() == title.toLowerCase())
                        resolve(group);
                    //console.log("group");
                    //console.log(group);
                })

                
            }).catch((e) => {
                reject(e);
            })
        })

        return promise;
    }


    static async getDbHomeworkByStudentBoardAndGroupAndItemID(studentBoardID, studentGroupID, studentItemID)
    {

        let teacherStudents = await TeacherStudentModel.findAll({ where: {
 
            [Op.and] : [
                {
                    studentBoardID: "" + studentBoardID,
                    studentGroupID: "" + studentGroupID,
                    studentItemID: "" + studentItemID
                }
            ]
            
        }});

        teacherStudents = JSON.stringify(teacherStudents);
        teacherStudents = JSON.parse(teacherStudents);

        var teacherStudent = teacherStudents[0];


        let homeworks = await HomeworkModel.findAll({ where: {
 
                [Op.and] : [
                    {
                        boardID: "" + teacherStudent.teacherBoardID,
                        groupID: "" + teacherStudent.teacherGroupID,
                        itemID: "" + teacherStudent.teacherItemID
                    }
                ]
            
        }});

        homeworks = JSON.stringify(homeworks);
        homeworks = JSON.parse(homeworks);

        return homeworks[0];
        
    }

    static async getDbStudentBoardID(boardID)
    {
        let students = await StudentModel.findAll({ where: {
            boardID : {
                [Op.like] : "" + boardID
            }
        }});

        students = JSON.stringify(students);
        students = JSON.parse(students);

        if(students.length > 0)
            return students[0];
        else
            return null;
    }

    static searchColumnValue(item, id)
    {
        var result = null;
        item.column_values.forEach((colvalue) => {
            console.log("searchColumnValue")
            console.log(colvalue.id + " == " + id);
            if(colvalue.id == id)
            {
                result = colvalue;
            }
        });

        return result;
    }

    static async deleteDbHomeworkAndStudent(dbHomework, dbStudent)
    {
        if(dbHomework != null)
        {
            await HomeworkStudentModel.destroy({ where: { [Op.and] : [ { studentId: dbStudent.id }, { homeworkId : dbHomework.id } ] }})
        }
    }

    static async getDbHomeworkStudentByDbHomeworkAndStudent(dbHomework, dbStudent)
    {
        let homeworkStudents = await HomeworkStudentModel.findAll({ where: { [Op.and] : [ { studentId: dbStudent.id }, { homeworkId : dbHomework.id } ] }})
        if(homeworkStudents.length > 0)
            return homeworkStudents[0]
        else 
            return null;
    }

    static async createDbHomeworkStudent(message)
    {
        var item = await this.getItem(message.event.pulseId);
        var studentBoardGroup = await this.getBoardGroup(message.event.boardId, message.event.groupId );
        var subjectName = studentBoardGroup.title;
        var homeworkName = item.name;
        
        
        var dbHomework = await this.getDbHomeworkByStudentBoardAndGroupAndItemID(message.event.boardId, message.event.groupId, item.id );
        var dbStudent = await this.getDbStudentBoardID(message.event.boardId)

        console.log("DbStudent")
        console.log(dbStudent);
        
        console.log("DbHomework")
        console.log(dbHomework);
        
        this.deleteDbHomeworkAndStudent(dbHomework, dbStudent);

        console.log("Student column values");
        console.log(JSON.stringify(item.column_values));


        var homeworkStudent = {};
        homeworkStudent.homeworkId = dbHomework.id;
        homeworkStudent.studentId = dbStudent.id;
        homeworkStudent.boardID = message.event.boardId;
        homeworkStudent.groupID = message.event.groupId;
        homeworkStudent.itemID = item.id;      

        console.log("homeworkStudent");
        console.log(homeworkStudent);
        
        await HomeworkStudentModel.create(homeworkStudent);
    }


    static async updateDbHomeworkStudent(message)
    {
        var item = await this.getItem(message.event.pulseId);
        var studentBoardGroup = await this.getBoardGroup(message.event.boardId, message.event.groupId );
        var subjectName = studentBoardGroup.title;
        var homeworkName = item.name;
        
        var dbHomework = await this.getDbHomeworkByStudentBoardAndGroupAndItemID(message.event.boardId, message.event.groupId, item.id );
        var dbStudent = await this.getDbStudentBoardID(message.event.boardId)
        var dbHomeworkStudent = await this.getDbHomeworkStudentByDbHomeworkAndStudent(dbHomework, dbStudent);

        console.log("Student column values");
        console.log(JSON.stringify(item.column_values));

        console.log("DbHomework")
        console.log(dbHomework);

        console.log("DbStudent")
        console.log(dbStudent);

        if(dbHomeworkStudent != null)
        {
            let colValueStatus = this.searchColumnValue(item, "status_1");
            dbHomeworkStudent.homeworkId = dbHomework.id;
            dbHomeworkStudent.studentId = dbStudent.id;
            dbHomeworkStudent.boardID = message.event.boardId;
            dbHomeworkStudent.groupID = message.event.groupId;
            dbHomeworkStudent.itemID = item.id;    
            dbHomeworkStudent.homeworkStatus =  colValueStatus.text;

            let sts = colValueStatus.text.toLowerCase().replace(/\s/gi, "");
            console.log("sts");
            console.log(sts);

            if(sts == "done")
                dbHomeworkStudent.submittedDate = new Date();

            dbHomeworkStudent = JSON.stringify(dbHomeworkStudent);
            dbHomeworkStudent = JSON.parse(dbHomeworkStudent);

            console.log("dbHomeworkStudent");
            console.log(dbHomeworkStudent);
            
            await HomeworkStudentModel.update(dbHomeworkStudent, { where: { id: dbHomeworkStudent.id } });
        }
    }

    static async handleMessage(message)
    {
        let maps = await this.getMappings();
        if(message.event.type == "create_pulse")
        {
            this.createDbHomeworkStudent(message);
        }
        else
        {
            this.updateDbHomeworkStudent(message);
        }
        
    }

    static createColumnValues(colValues, maps)
    {

        let column_values = {};
        let mapCol = null;
        colValues.forEach((colValue) => {
            let colName = colValue.id;
            mapCol = this.mapByFieldname(colName, maps);
            if(colValue.value != null)
            {
                console.log("mapCol")
                console.log(colName + " - " + mapCol)
                console.log(colValue.value)
                if(mapCol == null)
                    column_values[ "'" + colName + "'" ] = colValue.value;
                else
                {
                    var value = JSON.parse(colValue.value)
                    column_values[ "'" + colName + "'" ] = "'" + value[mapCol] + "'";
                }
                    
            }
        })
        
        return column_values;
    }

    static async createItem( boardId, groupId, item)
    {
        let query = "mutation { " +
        "create_item(board_id: " + boardId + ", group_id: \"" + groupId + "\", item_name: \"" + item.name + "\" ) " +
        "{ " +
        "      id " +
        "    } " +
        "  }";

        this.sendGraph(query).then((response) => {

        })
    }

    static async getMappings()
    {
        let promise = new Promise(async (resolve, reject) => {
            let data = await MappingModel.findAll();
            data = JSON.stringify(data);
            data = JSON.parse(data);
            resolve(data);
        });
        return promise;
    }

    static mapByFieldname(fieldName, mappings)
    {
        var result = null;
        mappings.map((map)=>{

            console.log(map.fieldname +  " ++++ " + fieldName)
            if(map.fieldname == fieldName)
            {
                result = map.map;
            }
                
        })

        return result;
    }


    static async deleteItem(item_id)
    {
        let promise = new Promise((resolve, reject)=>{
            let query = "mutation { " +
            " delete_item (item_id: " + item_id + ") { " +
            " id " +
            " } " +
            " }";

            this.sendGraph(query).then((response) => {
                resolve(response);
            }).catch(err =>{
                reject(err);
            })
        })

        return promise;

    }

    static replaceAll(ss, s1, s2)
    {
        var l = ss.length - 1;
        for(var i = 0; i < ss.length; i++)
        {
            //var stemp = ss.substring(i, l);
            ss = ss.replace(s1, s2);
        }

        return ss;
    }

    static async updateItem( boardId, groupId, item, studentGroupItems )
    {
        let maps = await this.getMappings();
        let column_values = this.createColumnValues(item.column_values, maps);
        
        let scolvalues =  JSON.stringify(column_values)
        scolvalues = this.replaceAll(scolvalues, "\"{", "{");
        scolvalues = this.replaceAll(scolvalues, "}\"", "}");

        scolvalues = this.replaceAll(scolvalues,  "\"'", "\\\"");
        scolvalues = this.replaceAll(scolvalues, "'\"", "\\\"");
        scolvalues = this.replaceAll(scolvalues, "\"{", "{");

        let itemid = null;
        studentGroupItems.forEach(async (studentItem) =>{
 
            if(studentItem.name.toLowerCase() == item.name.toLowerCase())
            {
                console.log("Delete item "  + studentItem.name)
                await this.deleteItem(studentItem.id)

                let query = "mutation { " +
                "create_item(board_id: " + boardId + ", group_id: \"" + groupId + "\", item_name: \"" + item.name + "\", " +
                " column_values : \"" + scolvalues + "\"" +
                " ) " +
                "{ " +
                "      id " +
                "    } " +
                "  }";

                console.log(query);
        
                this.sendGraph(query).then((response) => {
        
                })
            }
        })

       

    }

    static async Test(rr)
    {
        console.log("here");
        let query = '{ boards (limit:5) {name id} }';
        console.log(query)

        //Create connection called 'client' that connects to Monday.com's API
        const client = new GraphQLClient('https://api.monday.com/v2', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEwNTc3NTg2OCwidWlkIjoxMjE0NTQ1NywiaWFkIjoiMjAyMS0wNC0wOFQwNToxNjo0Mi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjQ4MTQ1NywicmduIjoidXNlMSJ9.hFUZN6fnpionJ7Pka1VqHqJNj2sDhkN9P57_UJPFKtA'
            },
        });

        client.request(query).then(data => console.log(data));

            
    }

    
}

module.exports = StudentLogic;