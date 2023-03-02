const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data)

    const url = "https://us8.api.mailchimp.com/3.0/lists/36a2613087"
    const options = {
        method: "POST",
        auth: "amnan1:ee3625164fcb1ab6c71796ce2e25e62d-us8"
    }

    const request = https.request(url, options, function(response) {

        if(response.statusCode !== 200) {
            res.sendFile(__dirname + "/failure.html")
        } else {
            res.sendFile(__dirname + "/succes.html")
        }
        
        response.on("data", function(data) {
            console.log(JSON.parse(data))
        })
    })
    
    request.write(jsonData)
    request.end()
})

app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
    console.log("server running on port 3000")
})