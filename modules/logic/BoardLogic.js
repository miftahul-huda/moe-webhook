var HttpClient = require('./HttpClient');
const { Op } = require("sequelize");
const { GraphQLClient } = require('graphql-request');
const StudentModel = require("../model/studentmodel");
const MappingModel = require("../model/mappingmodel");
var HomeworkModel = require("../model/homeworkmodel")
var HomeworkstudentModel = require("../model/homeworkstudentmodel")
var TeacherStudentModel = require("../model/teacherstudentmodel")

class BoardLogic
{

    static getGraphClient()
    {


        //Create connection called 'client' that connects to Monday.com's API
        const client = new GraphQLClient('https://api.monday.com/v2', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.API_KEY
            },
        });
        return client;
    }

    static sendGraph(query)
    {
        let promise = new Promise((resolve, reject)=>{
            let client = this.getGraphClient();
            client.request(query).then((response)=>{
                console.log("\n\n=============BoardLogic.Query=============")
                console.log(query);
                console.log("\nBoardLogic.Response")
                console.log( JSON.stringify( response));
                console.log("=================\n\n")

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
            "      title " +
            "      text " +
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

    static async getBoardAndGroupsByBoardId(boardId)
    {
        let promise = new Promise((resolve, reject) => {
            let query = "{ " +
            "boards(ids: " + boardId + ") { " +
            "  groups() { " +
            "    id " +
            "    title " +
            "  } " +
            "} " +
            "}";



            this.sendGraph(query).then((response)=>{ 
                
                var boards = response.boards;
                if(boards.length > 0)
                    resolve(boards[0]);
                else
                    resolve(null);
                
            }).catch((e) => {
                reject(e);
            })
        })

        return promise; 
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
            "   workspace() " +
            "   { " +
            "       id " +
            "       name " +
            "   } " +
            "   groups(ids: " + groupId + ") { " +
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
                console.log(JSON.stringify(response));  
                
                var boards = response.boards;
                if(boards.length > 0)
                {
                    var board = boards[0];
                    var groups = board.groups;
                    if(groups.length > 0)
                        resolve( { board: board, group: groups[0]});
                    else
                        resolve(null)
                }
                else {
                    resolve(null)
                }
                
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
                if(boards.length == 0)
                    resolve(null)
                else
                {
                    var board = boards[0];
                    var groups = board.groups;
                    var selectedGroup = null;
                    groups.forEach((group) =>{
                        if(group.title.toLowerCase() == title.toLowerCase())
                            selectedGroup = group;
                            
                        //console.log("group");
                        //console.log(group);
                    })
                    resolve(selectedGroup);
                }

                
            }).catch((e) => {
                reject(e);
            })
        })

        return promise;
    }

    static async getStudentBoards(workspaceId)
    {
        let promise = new Promise((resolve, reject)=>{
            let query = "{" +
            "boards(limit:5000) {" +
            "       id " +
            "       name " +
            "       workspace() " +
            "       { " +
            "           id " +
            "           name " +
            "       } " +
            "   }" +
            "}";

        
            this.sendGraph(query).then((response)=>{
                var items = response.boards;
                let newItems = [];
                items.forEach((item)=>{
                    if(item.workspace != null && item.workspace.id == workspaceId)
                        newItems.push(item);
                })
                resolve(newItems);
            }).catch(err=>{ 
                
                console.log(err);
                reject(err);
            })
        });

        return promise;
                
    }

    static async handleMessage(message)
    {
        console.log("============ handleMessage() ================")
        let maps = await this.getMappings();
        var item = await this.getItem(message.event.pulseId);
        var teacherBoardGroup = await this.getBoardGroup(message.event.boardId, message.event.groupId );

        if(teacherBoardGroup != null)
        {
            var groupName = teacherBoardGroup.group.title;
            //var students = await this.getStudents();
            var students = await this.getStudentBoards(teacherBoardGroup.board.workspace.id);

            students.forEach(async (student, idx)=>{
                //let boardID = student.boardID;
                let boardID = student.id;
                if(boardID != message.event.boardId)
                {
                    let group = await this.getBoardGroupByTitle(boardID, groupName)
                    if(group != null)
                    {
                        //let groupWithItems = await this.getBoardGroup(boardID, group.id)

                        let column_values = this.createColumnValues(item.column_values, maps)
                        console.log(column_values)
                        //console.log("Student  : " + student.studentName);
                        console.log("message.event.boardId  : " + message.event.boardId);
                        console.log("Student  : " + student.name);
                        console.log("Board ID : " + student.id);
                        console.log("Group ID : " + JSON.stringify(group));
                        console.log("Group  : " + group.title);
                        console.log("Original Item  : " + JSON.stringify(item) + "\n");
                        console.log("Set Column Values : " + JSON.stringify(column_values) + "\n");

                        if(message.event.type == "create_pulse")
                        {
                            //Create item in student board and group
                            await this.createItem(boardID, group.id, item, message.event.boardId, message.event.groupId);
                            
                        }
                        else
                        {
                            //Update item in student board and group
                            await this.updateItem(boardID, group.id, item, message.event.boardId, message.event.groupId);
                        }
                    }
                    else {
                        console.log(student.name + " doesn't have group " + groupName);
                    }
                }
                else    
                {
                    console.log("This is the sender : ")
                    console.log("message.event.boardId  : " + message.event.boardId);
                    console.log("Student  : " + student.name);
                    console.log("Board ID : " + student.id);
                }
                    
            })

            if(message.event.type == "create_pulse")
            {
                //Save homework in database
                await this.saveNewItem(item, message.event.boardId, teacherBoardGroup );
                
            }
            else
            {
                //Update homework in database
                await this.saveUpdateItem(item, message.event.boardId, teacherBoardGroup );
            }
        }

        
    }

    static createColumnValues(colValues, maps)
    {
        console.log("============ createColumnValues() ================")
        let column_values = {};
        let mapCol = null;
        colValues.forEach((colValue) => {
            let colName = colValue.id;
            console.log("---------" + colName + " = " + colValue.value + ", text: " + colValue.text);
            mapCol = this.mapByFieldname(colName, maps);
            if(colValue.value != null)
            {
                if(mapCol == null)
                {
                    let colValue2 = colValue.value;
                    let ss = JSON.parse(colValue2);
                    if(typeof ss == 'string')
                        colValue2 = "'" + ss + "'";
                    column_values[ "'" + colName + "'" ] = colValue2;
                }
                else
                {
                    var value = JSON.parse(colValue.value)
                    column_values[ "'" + colName + "'" ] = "'" + value[mapCol] + "'";
                }
                    
            }
        })
        
        return column_values;
    }

    static async createItem( studentBoardId, studentGroupId, teacherItem, teacherBoardID, teacherGroupID)
    {
        console.log("============ createItem() ================")
        let query = "mutation { " +
        "create_item(board_id: " + studentBoardId + ", group_id: \"" + studentGroupId + "\", item_name: \"" + teacherItem.name + "\" ) " +
        "{ " +
        "      id " +
        "    } " +
        "  }";

        var me = this;
        this.sendGraph(query).then((response) => {
            let teacherStudent = {};
            teacherStudent.teacherBoardID = teacherBoardID;
            teacherStudent.teacherGroupID = teacherGroupID;
            teacherStudent.teacherItemID = teacherItem.id;
            teacherStudent.studentBoardID = studentBoardId;
            teacherStudent.studentGroupID = studentGroupId;
            teacherStudent.studentItemID = response.create_item.id;

            console.log("Create Teacher Student Connection")
            console.log(teacherStudent)
            TeacherStudentModel.create(teacherStudent);
        })
    }

    static searchColumnValue(item, id)
    {
        var result = null;
        item.column_values.forEach((colvalue) => {
            if(colvalue.id == id)
            {
                result = colvalue;
            }
        });

        return result;
    }

    static async saveNewItem(item, boardId, teacherBoardGroup)
    {
        console.log("============ saveNewItem() ================")
        var colStatus = this.searchColumnValue(item, "status");
        var homework = {};
        homework.homeworkTitle = item.name;
        homework.subject = teacherBoardGroup.group.title;
        homework.boardID = boardId;
        homework.groupID = teacherBoardGroup.group.id;
        homework.itemID = item.id;

        HomeworkModel.create(homework).then((response) => {
            console.log("Saved to database")
        }).catch((err) => {
            console.log(err);
        });
    }

    static async saveUpdateItem(item, boardId, teacherBoardGroup)
    {

        console.log("============ saveUpdateItem() ================")
        var colStatus = this.searchColumnValue(item, "status");
        var colDate = this.searchColumnValue(item, "date4");

        var homework = {};
        homework.homeworkTitle = item.name;
        homework.homeworkStatus = JSON.stringify(colStatus);
        homework.homeworkDueDate = JSON.stringify(colDate);
        homework.subject = teacherBoardGroup.group.title;
        homework.boardID = boardId;
        homework.groupID = teacherBoardGroup.group.id;

        HomeworkModel.update(homework, {
            where: {
                itemID: item.id
            }
        }).then((response) => {
            console.log("Saved to database")
        }).catch((err) => {
            console.log(err);
        });

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
            if(map.fieldname == fieldName)
            {
                result = map.map;
            }
                
        })

        return result;
    }


    static async deleteItem(item_id)
    {
        console.log("============ deleteItem() ================")
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

    static async getTeacherStudentByBoardGroupItem(teacherBoardID, teacherGroupID, teacherItemID, studentBoardID, studentGroupID )
    {
        console.log("============ getTeacherStudentByBoardGroupItem() ================")
        let result = await TeacherStudentModel.findAll({ 
            where: {
                [Op.and] : [
                    { teacherBoardID: "" + teacherBoardID },
                    { teacherGroupID: "" + teacherGroupID },
                    { teacherItemID: "" + teacherItemID },
                    { studentBoardID: "" + studentBoardID },
                    { studentGroupID: "" + studentGroupID }
                ]
            }
        });

        result = JSON.stringify(result);
        result = JSON.parse(result);

        if(result.length > 0)
            return result[0];
        else
            return null;
    }

    static async updateItem( studentBoardId, studentGroupId, teacherItem, teacherBoardID, teacherGroupID)
    {
        console.log("============ updateItem() ================")
        let maps = await this.getMappings();
        let column_values = this.createColumnValues(teacherItem.column_values, maps);
        column_values["'name'"] =  "'" + teacherItem.name + "'";
        
        let scolvalues =  JSON.stringify(column_values)
        scolvalues = this.replaceAll(scolvalues, "\"{", "{");
        scolvalues = this.replaceAll(scolvalues, "}\"", "}");

        scolvalues = this.replaceAll(scolvalues,  "\"'", "\\\"");
        scolvalues = this.replaceAll(scolvalues, "'\"", "\\\"");
        scolvalues = this.replaceAll(scolvalues, "\"{", "{");

        let itemid = null;

        let teacherStudent = await this.getTeacherStudentByBoardGroupItem(teacherBoardID, teacherGroupID, teacherItem.id, studentBoardId, studentGroupId);
        let studentItemID = teacherStudent.studentItemID;

        let query = "mutation { " +
        "change_multiple_column_values(board_id: " + studentBoardId + ",  item_id: " + studentItemID + ", " +
        " column_values : \"" + scolvalues + "\"" +
        " ) " +
        "{ " +
        "      id " +
        "    } " +
        "  }";

        console.log("query");
        console.log(query);

        this.sendGraph(query).then((response) => {

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

module.exports = BoardLogic;