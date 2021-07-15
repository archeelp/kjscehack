require('isomorphic-fetch');
require('isomorphic-form-data');
require('dotenv').config();

var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	session = require("express-session"),
	mongoose = require("mongoose"),
	expressSanitizer = require("express-sanitizer"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	user = require("./models/user"),
	review = require("./models/review"),
	feedback = require("./models/feedback"),
	appointment = require("./models/appointment"),
	message=require("./models/message"),
	days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
	faker = require("faker"),
	flash = require("connect-flash"),
	fetch = require("node-fetch"),
	path = require("path"),
	databaseURL = process.env.DATABASEURL || 'mongodb://localhost/clinicapp';
arcgisRestGeocoding = require('@esri/arcgis-rest-geocoding'), {
		geocode
	} = arcgisRestGeocoding,
	secret = process.env.SECRET || "We are clinicapp devlopers",
	dfff = require('dialogflow-fulfillment');
	http = require('http').createServer(app);
    client = require('socket.io').listen(http);
	customers={}
var client=require("socket.io").listen(http);
var nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'pblvjti@gmail.com',
		pass: 'urgonotgofbwfmsh'
	}
});

const fileUpload = require('express-fileupload');

mongoose.connect(databaseURL, {
	useNewUrlParser: true
});

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/images"));
app.use(express.static(path.join(__dirname, '/weights')))
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set("view engine", "ejs");
app.use(expressSanitizer());
app.use(flash());
app.use(fileUpload());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "We are clinicapp devlopers",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use("user", new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//PASSPORT CONFIGURATION COMPLETE

//MULTER AND CLOUDINARY CONFIGURATION

var multer = require('multer');
var storage = multer.diskStorage({
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function (req, file, cb) {
	// accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
var upload = multer({
	storage: storage,
	fileFilter: imageFilter
})

var cloudinary = require('cloudinary');
const { type } = require('os');
cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret
});

//MULTER AND CLOUDINARY CONFIGURATION COMPLETE

// //FAKER
// var imgurl =[
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz3WNCwhrhQPga14FTBfxLHWNRTgdHq8ahRNt5JT-1XtuYPtNp",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyNRmjP2FnYIhyfAY3Uk_SpTVPaPWhSfRb_f3z598ER0dxIFuw",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpZALWesbqageji2LOzFXRMPJ1LHGGf9_LzIsy3FlXW4-ZgW4B",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmJarQHXhA2Ia_wFdP7BcAigP6XYOodfJW2HIrWMKcZs90Do9MXA",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW_0LaX5oFL0sTR_lD7dkGkYfiQbgjM3wf64VMbz3N7TjZDUPS",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpzEMKsQO9Dp0p6ucQaGs24-8GNGfELL9V1lLKeJ8pTmGV3KcB",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpxkNYJ6KtsKx6WjV9qvAk4coqMzyy16HEL2JRQGeAxROXEIBv_A",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcdIp72bafvZvjZ8Ox23FVTLiknOUQYQtjcKKM-K4AUpYArT6d",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa_RWfFQvBdKuh09_xc1FIiINdbaevnMgECXuPTliIOXKcdLc3lw",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4MhB5szikoYS2O4wrSxf7Uv1ozK3g7Jvv9hMpVd1DWAjfO1rV",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyysKeS9tA8M9aMGM16Z2JoLGJw1FEcFazeBkvbb5hVjUXHszK",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG7nfyANOL6bnpWAM7t8Wa_qexZAv0Qbh4ZtytvimzeOCBEJCWBg",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFbW8Nchl9FZYzoViR6HfrX0CKxlOt25pcZXRMvQWHDnbF7vrl",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRonlKSi2v_FRMsiqTacpliFialJ-cKYDPaDsn2Fe4nihLCD6A60w",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlhnl6GNOZMtYiBZjBN8MhZsem7lY--ixyfIsZvsP2spik2X-U6Q",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7kZsZvtlvywBfHxPMVBDfdJf2zGNyyxHkO9amRCKmwIwS3aOE",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP78lnDrzvFbNrpVbqXLuWOpJRnzo9XctsaZle-x3Id2oZepFj",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWyrW2RIsMIT4JlKy4eXtW90hyAyGJiH4VyiGCAQg6U657qVww",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-GEu5a2iB-8pp49rzNSBiKRcoZ6qooZdzClcD9qp5Ord5p98C",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm6-1mr0XA8bUejNnUyVhUw-RPewYLlN4HDxVrrYW2vSTBfrjR",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtuiba2oW1u7uRyacSJquWPxDaT4xQw5aruaPyPGZhZUNcm_mW",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0s3n8uEPjkyw-hw6bMZ8Yb050QHrDsw9btOnRkJH0AdkfkKUz4Q",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD-gOtIqJgY4rU2tIGqQfVv-lJWwiyzmrj5UfacWjP3aws-_oL",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKMtdAk4ca4mZG3ytNzGzac-z79gpBvV4SeqhWSK4UakaAuJh_",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1gXhqkUbEcF7x1SnBGUq0IPsez9wtkYp3mjP3V-ej-ORQNnTv",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSPx2HomwOut_1Px4k25htU1e3UEeQ5nscHv-zvz30y0l1TKniVQ",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzg1nRE29B1Jt2uVJtbUGzpLY_VrbLyfr32bYpoT7lSRPAHSAF",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIV4mGu-Jez6WYpcLTNO5rUZkMj2ldkUeRSg9aBuhvXh4LXIfP",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzg1nRE29B1Jt2uVJtbUGzpLY_VrbLyfr32bYpoT7lSRPAHSAF",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlgcKHR4TO1SHV3uH8dgDwiaXfRB_A4p1qcxarGrmvkicMTkN0cw",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuK_qYifPCWLAHbVPfpzh25S2aI4aXiR-pnXHPtHljlwl87we7",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6MZ_sJd--OASUOMNakui3jAsh06YS5tiyI7fnYZUpzMxHBGe2_g",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfYB35iFfj_iMt0bb0BGm-gVOYoGMsXadvFQZo6o15zxw-MOmZ",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRYNw9IxrqOD0YCXDYOzzQFvv-8h5btBaBYPmt9uy6hMBTUJHl",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-eh1nC_ddzeEz9AWwm6cqfaED0BtUUD4PKbZMeKJVUYaVgI-",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0VE12kQ1GPhonPrv6lesEMxLeKf5EbH-fW94IzWs2RkWXW75g",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbxCVATFctzcCxwY4KvKb2L2SUYIct1otzVCORL7RNuFWt_7Lf",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK8laymHV1vVTD0fK1sLa_-FPQ-sS7EWAAqzpa4mv_AYBaEtDozA",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbMP5N9brH2djTqaSVJ5XgMKKexBaJAVvUwjw3p8mZjzcU2MiO",
// "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVV2C9Wd4dmYbsUCn_H5I4BMn9UYZsKmwvQcKVcaKMCMuXJB58"
// ];
// for(i=0;i<40;i++){
// 		var suser = {
// 			username: faker.internet.userName(),
// 			type: "doctor",
// 			fname: faker.name.firstName(),
// 			lname: faker.name.lastName(),
// 			email: faker.internet.email(),
// 			contactnumber: faker.phone.phoneNumber(),
// 			image: imgurl[i],
// 			address: faker.address.streetAddress(),
// 			description: faker.lorem.paragraph()
// 		};
// 		user.register(suser, "Arch1234" ,function(err, newlyCreated){
// 			if(err){
// 				console.log(err);
// 				return res.render("signup");
// 			}
// 			else{
// 				console.log("Registered")
// 				geocode(newlyCreated.address).then((response) => {
// 					Object.assign(newlyCreated, {
// 						loc: {
// 							x: response.candidates[0].location.x,
// 							y: response.candidates[0].location.y
// 						}

// 					})
// 					console.log("x and y assigned")

// 					newlyCreated.schedule.push({
// 						day :"monday",
// 						from :"10",
// 						to :"12"
// 						});
// 						newlyCreated.schedule.push({
// 							day :"tuesday",
// 							from :"11",
// 							to :"13"
// 						});
// 						newlyCreated.save();
// 				});

// 			}
// 		});

//complete	
// var suser = {
// 	username: faker.internet.userName(),
// 	type: "doctor",
// 	fname: faker.name.firstName(),
// 	lname: faker.name.lastName(),
// 	email: faker.internet.email(),
// 	contactnumber: faker.phone.phoneNumber(),
// 	image: imgurl[i],
// 	address: faker.address.streetAddress(),
// 	description: faker.lorem.paragraph()
// };		
// geocode(suser.address).then((response) => {
// 		test = response;
// 		Object.assign(suser, {
// 			loc: {
// 				x: response.candidates[0].location.x,
// 				y: response.candidates[0].location.y
// 			}
// 		})
// 		console.log(suser.loc.x + " Inside " + suser.loc.y);
// 	})
// console.log(test);



//}
//COMPLETE

app.use(function (req, res, next) {
	res.locals.currentuser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.warning = req.flash("warning");
	res.locals.info = req.flash("success");
	next();
});

app.get("/", async function (req, res) {
// 	let response = await fetch("https://newsapi.org/v2/everything?q=COVID&from=2021-06-01&sortBy=publishedAt&apiKey=920ce28a536e42328e05cd802508cca6&pageSize=30&page=2&language=en");
// 	response = await response.json();
// 	console.log(response)
	res.render("homepage", {
		response: []//response.articles
	});
});

app.get("/contacts", function (req, res) {
	res.render("contacts");
});

app.get("/poseMatch", function (req, res) {
	res.render("poseMatch");
});

// ABOUT
app.get("/about", function (req, res) {
	res.render("about");
});

app.get("/signup", nouser, function (req, res) {
	res.render("signup");
});

app.get("/signin", nouser, function (req, res) {
	res.render("signin");
});

app.get("/aplist", isLoggedIn, isdoctor, function (req, res) {
	var counts = {}
	user.findById(req.user._id).populate("appointments").exec(async function(err,appts){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else{
			console.log("appts-",appts);
			appts.appointments.forEach(function(apt){
				if(!counts[`${apt.appointmentdate.getDate()}/${apt.appointmentdate.getMonth()+1}/${apt.appointmentdate.getFullYear()}`]) counts[`${apt.appointmentdate.getDate()}/${apt.appointmentdate.getMonth()+1}/${apt.appointmentdate.getFullYear()}`]=1;
				else counts[`${apt.appointmentdate.getDate()}/${apt.appointmentdate.getMonth()+1}/${apt.appointmentdate.getFullYear()}`]++;
			});
			console.log("counts =",counts);
			res.render("aplist",{counts: counts});
		}
	});
});

app.get("/profileupdate", isLoggedIn, isdoctor, function (req, res) {
	res.render("profileupdate");
});

app.get("/picupdate", isLoggedIn, isdoctor, function (req, res) {
	res.render("picupdate");
});

app.get("/feedback", isLoggedIn, function (req, res) {
	res.render("feedback");
});

app.get("/chats/:id",isLoggedIn,function(req,res){
	appointment.findById(req.params.id,function(err,foundUser){
		if(err)
		{
			req.flash('error','Something went wrong');
			// return res.redirect('back');
		}
		else
		{
			console.log(foundUser)
			res.render("chat",{user:foundUser});	
		}
			
	})
	
})

app.post("/feedback", isLoggedIn, function (req, res) {
	var fb = req.sanitize(req.body.feedback.feedback),
		un = req.sanitize(req.body.feedback.username);
	feedback.create({
		feedback: fb,
		username: un
	}, function (err, newfeedback) {
		if (err || !newfeedback) {
			req.flash("error", "An error occured while submittng your feedback please try again later");
			res.redirect("back");
		} else {
			req.flash("success", "Feedback submitted successfully ");
		}
	});
	res.redirect("/");
});

app.post("/profileupdate", isLoggedIn, isdoctor, function (req, res) {
	user.findById(req.user._id, function (err, doctor) {
		if (err) {
			req.flash("error", "An Error Occured");
			res.redirect("back");
		} else {
			doctor.schedule = [];
			if (req.body.id0 == "on") {
				doctor.schedule.push({
					day: days[0],
					from: req.body.id0from,
					to: req.body.id0to
				});
			}
			if (req.body.id1 == "on") {
				doctor.schedule.push({
					day: days[1],
					from: req.body.id1from,
					to: req.body.id1to
				});
			}
			if (req.body.id2 == "on") {
				doctor.schedule.push({
					day: days[2],
					from: req.body.id2from,
					to: req.body.id2to
				});
			}
			if (req.body.id3 == "on") {
				doctor.schedule.push({
					day: days[3],
					from: req.body.id3from,
					to: req.body.id3to
				});
			}
			if (req.body.id4 == "on") {
				doctor.schedule.push({
					day: days[4],
					from: req.body.id4from,
					to: req.body.id4to
				});
			}
			if (req.body.id5 == "on") {
				doctor.schedule.push({
					day: days[5],
					from: req.body.id5from,
					to: req.body.id5to
				});
			}
			if (req.body.id6 == "on") {
				doctor.schedule.push({
					day: days[6],
					from: req.body.id6from,
					to: req.body.id6to
				});
			}
			doctor.save();
			req.flash("success", "Successfully Updated!");
			res.redirect("/doctors/" + doctor._id);
		}
	});
});

app.post("/picupdate", isLoggedIn, isdoctor, upload.single('image'), function (req, res) {
	user.findById(req.user._id, async function (err, doctor) {
		if (err) {
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			if (req.file) {
				try {
					await cloudinary.v2.uploader.destroy(doctor.image_id);
					var result = await cloudinary.v2.uploader.upload(req.file.path);
					doctor.image_id = result.public_id;
					doctor.image = result.secure_url;
				} catch (err) {
					req.flash("error", err.message);
					return res.redirect("back");
				}
			}
			doctor.description = req.body.description;
			doctor.address = req.body.address;
			geocode(req.body.address).then((response) => {
				Object.assign(doctor, {
					loc: {
						x: response.candidates[0].location.x,
						y: response.candidates[0].location.y
					}
				})
				doctor.save();
				req.flash("success", "Successfully Updated!");
				res.redirect("/doctors/" + doctor._id);
			});


		}
	});
});

app.get("/stats", isLoggedIn, isdoctor, function (req, res) {
	user.findById(req.user._id).populate("appointments").exec(function (err, founddoctor) {
		if (err || !founddoctor) {
			console.log(err);
		} else {
			var appo = [];
			var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
			var d = new Date();
			var c = new Date();
			var sub = 30 - Number(d.getDate());
			d.setTime(c.getTime() + sub * 24 * 60 * 60 * 1000);
			for (i = -1; d.getMonth() == c.getMonth(); i--) {
				req.user.schedule.forEach(function (schedule) {
					if (schedule.day == days[d.getDay()]) {
						var j = 0;
						founddoctor.appointments.reverse();
						founddoctor.appointments.forEach(function (appointment) {
							if (d.getDate() == appointment.appointmentdate.getDate() &&
								d.getMonth() == appointment.appointmentdate.getMonth() &&
								d.getFullYear() == appointment.appointmentdate.getFullYear()) {
								j++;
							}
						});
						var month = d.getMonth() + 1;
						var t = d.getDate() + "/" + month + "/" + d.getFullYear();
						appo.push({
							label: t,
							y: j
						});
					}
				});
				d.setTime(c.getTime() + sub * 24 * 60 * 60 * 1000 + i * 24 * 60 * 60 * 1000);
			}
			res.render("stats", {
				appointmentdata: appo
			});
		}
	});
});

app.get("/doctorhome/date/:id", isLoggedIn, isdoctor, function (req, res) {
	user.findById(req.user._id).populate("appointments").exec(function (err, founddoctor) {
		if (err) {
			req.flash("error", "Doctor Not Found");
			res.redirect("back");
		} else {
			var appo1 = [];
			var appo2 = [];
			var addappo = false;
			founddoctor.appointments.forEach(function (appointment) {
				var t = new Date();
				t.setTime(req.params.id);
				if (t.getDate() == appointment.appointmentdate.getDate() &&
					t.getMonth() == appointment.appointmentdate.getMonth() &&
					t.getFullYear() == appointment.appointmentdate.getFullYear()) {
					if (appointment.time) {
						appo1.push(appointment);
					} else {
						appo2.push(appointment);
					}
				}
			});
			appo1.sort(function (a, b) {
				var temp1 = 60 * Number(a.time[0] + a.time[1]) + Number(a.time[3] + a.time[4]);
				var temp2 = 60 * Number(b.time[0] + b.time[1]) + Number(b.time[3] + b.time[4]);
				return temp1 - temp2;
			})
			var t1 = new Date();
			t1.setTime(req.params.id);
			var t2 = new Date();
			t2.setTime(Date.now());
			if (t1.getDate() >= t2.getDate()) {
				addappo = true;
			} else if (t1.getMonth() > t2.getMonth()) {
				addappo = true;
			}
			res.render("doctorhome", {
				appointments: appo1,
				oappointments: appo2,
				addappo: addappo,
				T: t1
			});
		}
	});
});

app.get("/patienthome", isLoggedIn, ispatient, function (req, res) {
	user.findById(req.user._id).populate("appointments").exec(function (err, foundpatient) {
		if (err || !foundpatient) {
			req.flash("error", "Sorry!! An error occured");
			res.redirect("back");
		} else {
			res.render("patienthome", {
				patient: foundpatient
			});
		}
	});
});

app.get("/admin", isLoggedIn, isadmin, function (req, res) {
	feedback.find({}, function (err, allfeedbacks) {
		if (err || !allfeedbacks) {
			req.flash("info", "No feedback found");
			res.redirect("/");
		} else {
			res.render("admin", {
				feedbacks: allfeedbacks
			});
		}
	});
});

app.get("/logout", isLoggedIn, function (req, res) {
	req.logout();
	req.flash("success", "Logged Out Successfully");
	res.redirect("/");
});

app.post("/signup", function (req, res) {
	var suser = {
		username: req.sanitize(req.body.username),
		type: req.body.type,
		fname: req.sanitize(req.body.fname),
		lname: req.sanitize(req.body.lname),
		email: req.sanitize(req.body.email),
		contactnumber: req.sanitize(req.body.contactnumber)
	};
	user.register(suser, req.body.password, function (err, newlyCreated) {
		if (err || !newlyCreated) {
			req.flash("error", "A user With That username Already Exists");
			return res.render("signup");
		}
		passport.authenticate("user")(req, res, function () {
			req.flash("success", "Sign Up Successful");
			res.redirect("/");
		});
	});
});


app.get("/details/:id", isLoggedIn, isdoctor, nodoctordes, function (req, res) {
	var pm = {
		id: req.params.id
	};
	res.render("docdes", {
		pm: pm
	});
});

app.post("/doctors/:id/deletereview", isLoggedIn, ispatient, function (req, res) {
	review.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			req.flash("error", "Failed To Delete Review");
			res.redirect("back");
		} else {
			res.redirect("/doctors");
		}
	})
});

app.post("/details/:id", isLoggedIn, isdoctor, nodoctordes, upload.single('image'), function (req, res) {
	cloudinary.uploader.upload(req.file.path, function (result) {
		user.findById(req.params.id, function (err, founddoctor) {
			if (err) {
				req.flash("error", "An Error Occured!! Please Try Again Later");
				res.redirect("back");
			} else {
				if (result.secure_url) {
					geocode(req.sanitize(req.body.address)).then((response) => {
						founddoctor.loc.x = response.candidates[0].location.x;
						founddoctor.loc.y = response.candidates[0].location.y;
						founddoctor.image = result.secure_url;
						founddoctor.image_id = result.public_id;
						founddoctor.description = req.sanitize(req.body.description);
						founddoctor.address = req.sanitize(req.body.address);
						if (req.body.id0 == "on") {
							founddoctor.schedule.push({
								day: days[0],
								from: req.body.id0from,
								to: req.body.id0to
							});
						}
						if (req.body.id1 == "on") {
							founddoctor.schedule.push({
								day: days[1],
								from: req.body.id1from,
								to: req.body.id1to
							});
						}
						if (req.body.id2 == "on") {
							founddoctor.schedule.push({
								day: days[2],
								from: req.body.id2from,
								to: req.body.id2to
							});
						}
						if (req.body.id3 == "on") {
							founddoctor.schedule.push({
								day: days[3],
								from: req.body.id3from,
								to: req.body.id3to
							});
						}
						if (req.body.id4 == "on") {
							founddoctor.schedule.push({
								day: days[4],
								from: req.body.id4from,
								to: req.body.id4to
							});
						}
						if (req.body.id5 == "on") {
							founddoctor.schedule.push({
								day: days[5],
								from: req.body.id5from,
								to: req.body.id5to
							});
						}
						if (req.body.id6 == "on") {
							founddoctor.schedule.push({
								day: days[6],
								from: req.body.id6from,
								to: req.body.id6to
							});
						}
						founddoctor.save();
						req.flash("success", "Details Added Successfully");
						res.redirect("/aplist");
					});
				} else {
					req.flash("error", "An Error Occured!! Please Try Again Later");
					res.redirect("back");
				}
			}
		});
	});
});

app.get("/doctors", function (req, res) {
	//
	var noMatch = false;
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		// Get all users from DB
		user.find({
			fname: regex
		}, function (err, alldoctors) {
			if (err) {
				console.log(err);
			} else {
				if (alldoctors.length < 1) {
					noMatch = true;
				}
				res.render("doctors", {
					doctors: alldoctors,
					noMatch: noMatch
				});
			}
		});
	} else {
		// Get all users from DB
		user.find({}, function (err, alldoctors) {
			if (err) {
				console.log(err);
			} else {
				res.render("doctors", {
					doctors: alldoctors,
					noMatch: noMatch
				});
			}
		});
	}
});

app.get("/:id", function (req, res, next) {
	user.findById(req.params.id, function (err, doctor) {
		if (err || !doctor) {
			req.flash("error", "Doctor Not Found");
			res.redirect("back");
		} else {
			if (doctor.type == "doctor" && doctor.address) {
				return next();
			} else {
				req.flash("error", "Doctor Not Found");
				res.redirect("back");
			}
		}
	});
}, function (req, res) {
	user.findById(req.params.id).populate("reviews").populate("appointments").exec(function (err, founddoctor) {
		if (err || !founddoctor) {
			console.log(err);
		} else {
			// geocode(founddoctor.address);
			// .then((response) => {
			//   loc={x:response.candidates[0].location.x,
			// 	y:response.candidates[0].location.y}; 
			// 	res.render("show", {
			// 		doctor: founddoctor,loc:loc
			// 	});
			// });
			res.render("show", {
				doctor: founddoctor
			});
		}
	});
});

app.get("/history/:id", isLoggedIn, isdoctor, function (req, res) {
	user.findById(req.params.id).populate("appointments").exec(function (err, foundpatient) {
		if (err || !foundpatient) {
			req.flash("error", "Patient Not Found");
			res.redirect("back");
		} else {
			res.render("history", {
				patient: foundpatient
			});
		}
	});
});

app.get("/doctors/:id/:id2/newreview", isLoggedIn, ispatient,
	function (req, res, next) {
		appointment.findById(req.params.id2, function (err, foundappointment) {
			if (err || !foundappointment) {
				req.flash("error", "an error occured")
			} else {
				if (foundappointment.status == "CNF") {
					return next();
				} else {
					req.flash("error", "You can leave a review only after your appointment is completed");
					res.redirect("back");
				}
			}
		});
	},
	function (req, res) {
		// find doctor by id
		user.findById(req.params.id, function (err, doctor) {
			if (err || !doctor) {
				console.log(err);
			} else {
				res.render("newreview", {
					doctor: doctor
				});
			}
		})
	});

app.post("/doctors/:id/newreview", isLoggedIn, ispatient, function (req, res) {
	user.findById(req.params.id, function (err, doctor) {
		if (err || !doctor) {
			req.flash("error", "An Error Occured!! Please Try Again");
			res.redirect("back");
		} else {
			review.create(req.body.review, function (err, review) {
				if (err || !review) {
					console.log(err);
				} else {
					review.author.id = req.sanitize(req.user._id);
					review.text = req.sanitize(req.body.text);
					review.author.username = req.user.username;
					review.save();
					doctor.reviews.push(review);
					doctor.save();
					res.redirect("/doctors/" + doctor._id);
				}
			});
		}
	});
});

app.get("/doctors/:id/bookappointment", isLoggedIn, ispatient, function (req, res) {
	user.findById(req.params.id, function (err, doctor) {
		if (err || !doctor) {
			req.flash("error", "An Error Occured!! Please Try Again");
			res.redirect("back");
		} else {
			res.render("bookappointment", {
				doctor: doctor
			});
		}
	})
});

app.post("/doctors/:id/bookappointment", isLoggedIn, ispatient, function (req, res) {
	user.findById(req.params.id, function (err, doctor) {
		if (err || !doctor) {
			req.flash("error", "An Error Occured!! Please Try Again");
			res.redirect("back");
		} else {
			appointment.create({
				patientname: req.user.fname,
				doctorname: doctor.fname,
				patientcn: req.user.contactnumber,
				doctorcn: doctor.contactnumber,
				appointmentdate: req.body.appointmentdate,
				doctorid: doctor._id,
				patientid: req.user._id
			}, function (err, appointment) {
				if (err || !appointment) {
					req.flash("error", "An Error Occured!! Please Try Again");
					res.redirect("back");
				} else {
					appointment.save();
					doctor.appointments.push(appointment);
					doctor.save();
					req.user.appointments.push(appointment);
					req.user.save();
					req.flash("success", "Your Appointment Request Has Been Sent .Please Wait For Confirmation");
					res.redirect("/patienthome");
				}
			});
		}
	});
});

app.get("/doctors/:id/bookappointment/:appointmentdate", isLoggedIn, ispatient, function (req, res) {
	user.findById(req.params.id, function (err, doctor) {
		if (err || !doctor) {
			req.flash("error", "An Error Occured!! Please Try Again");
			res.redirect("back");
		} else {
			appointment.create({
				patientname: req.user.fname,
				doctorname: doctor.fname,
				patientcn: req.user.contactnumber,
				doctorcn: doctor.contactnumber,
				appointmentdate: new Date(req.params.appointmentdate),
				doctorid: doctor._id,
				patientid: req.user._id
			}, function (err, appointment) {
				if (err || !appointment) {
					console.log(err);
					req.flash("error", "An Error Occured!! Please Try Again");
					res.redirect("back");
				} else {
					appointment.save();
					doctor.appointments.push(appointment);
					doctor.save();
					req.user.appointments.push(appointment);
					req.user.save();
					req.flash("success", "Your Appointment Request Has Been Sent .Please Wait For Confirmation");
					res.redirect("/patienthome");
				}
			});
		}
	});
});

app.post("/addappointment", isLoggedIn, isdoctor, function (req, res) {
	user.findById(req.user.id, function (err, doctor) {
		if (err || !doctor) {
			req.flash("error", "An Error Occured!! Please Try Again");
			res.redirect("back");
		} else {
			appointment.create({
				patientname: req.sanitize(req.body.patientname),
				doctorname: doctor.fname,
				patientcn: req.sanitize(req.body.patientcn),
				doctorcn: doctor.contactnumber,
				appointmentdate: req.body.appointmentdate,
				doctorid: doctor._id
			}, function (err, appointment) {
				if (err || !appointment) {
					req.flash("error", "An Error Occured!! Please Try Again");
					res.redirect("back");
				} else {
					appointment.save();
					doctor.appointments.push(appointment);
					doctor.save();
					req.flash("success", "Appointment Added Successfully");
					res.redirect("/doctorhome/date/" + new Date(req.body.appointmentdate).getTime());
				}
			});
		}
	});
});

app.post("/signin", nouser, passport.authenticate("user", {
	successRedirect: "/",
	failureRedirect: "/signin"
}), function (req, res) {});

//  app.post("/signin",nouser, passport.authenticate("user"), function(req, res){
// 	 if(req.isAuthenticated){
// 		req.flash("success","Sign In Successful");
// 		res.redirect("/");
// 	 }
// });

app.get("/doctorhome/:id", isLoggedIn, isdoctor, function (req, res) {
	var pm = {
		id: req.params.id
	};
	appointment.findById(req.params.id, function (err, foundappointment) {
		if (err || !foundappointment) {
			req.flash("error", "Appointment Not Found");
			res.redirect("back");
		} else {
			res.render("appointmentdetails", {
				appointment: foundappointment,
				pm: pm,
				lengthh: foundappointment.fileuploads.length
			});
		}
	});
});

app.post("/doctorhome/:id", isLoggedIn, isdoctor, async function (req, res) {
	appointment.findById(req.params.id, function (err, foundappointment) {
		if (err || !foundappointment) {
			req.flash("error", "Appointment Not Found");
			res.redirect("back");
		} else {
			if (req.body.status == "C") {
				foundappointment.status = "C";
				foundappointment.time = req.sanitize(req.body.time);
				foundappointment.save();
				appointment.findById(req.params.id).populate("patientid").exec(function (err, patient) {
					if (err || !patient) {
						console.log(err)
						res.redirect("back");
					} else {
						console.log(patient);
						var mailOptions = {
							from: 'pblvjti@gmail.com',
							to: patient.patientid.email,
							subject: 'Email for confirmation of appointment',
							text: 'Your appointment is confirmed!'
						};

						console.log(mailOptions);
						transporter.sendMail(mailOptions, function (error, info) {
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}
						});
					}
				})
				req.flash("success", "Appointment Details Updated");
				res.redirect("back");
			}
			if (req.body.status == "R") {
				foundappointment.status = "R";
				foundappointment.save();
				user.findById(req.user.id, function (err, founddoctor) {
					if (err) {
						console.log(err);
					} else {
						founddoctor.appointments.pop(foundappointment);
						founddoctor.save();
						req.flash("success", "Appointment Details Updated");
						res.redirect("back");
					}
				});
			}
			if (req.body.status == "CNF") {
				foundappointment.status = "CNF";
				foundappointment.description = req.sanitize(req.body.description);
				foundappointment.prescription = req.sanitize(req.body.prescription);
				foundappointment.billamount = req.sanitize(req.body.billamount);
				foundappointment.save();
				req.flash("success", "Appointment Details Updated");
				res.redirect("back");
			}
		}
	});
});

app.get("/patienthome/:id", isLoggedIn, ispatient, async function (req, res) {
	appointment.findById(req.params.id, function (err, foundappointment) {
		if (err || !foundappointment) {
			req.flash("error", "Appointment Not Found");
			res.redirect("back");
		} else {
			if (foundappointment.prescription)
				Promise.all(foundappointment.prescription.split(",").map((prescription) => fetch(`https://pharmeasy.in/api/search/search/?intent_id=1610822855978&page=1&q=${prescription}`)))
				.then((meds) => Promise.all(meds.map((med) => med.json())))
				.then((meds) => meds.map(({
					data: {
						products
					},
					query: {
						q
					}
				}) => {
					return {
						q,
						...products[0]
					}
				}))
				.then((products) => res.render("adp", {
					appointment: foundappointment,
					products
				}))
				.catch(err => console.log(err));
			else {
				res.render("adp", {
					appointment: foundappointment,
					id: req.params.id
				});
			}
		}
	});
});

app.post("/patienthome/:id", function(req,res){
	appointment.findById(req.params.id,function(err,foundappointment){
		if(err){
			req.flash("error", "Appointment Not Found");
			return res.redirect("back");
		} else {
			res.render('checkout', {appointment : foundappointment})
		};
	});
});

app.post("/pay" , async (req,res) => {
	console.log(req);
	const { paymentMethodId, items, app_id, currency } = req.body;
  
	const orderAmount = req.body.amount;

  
	try {
	  // Create new PaymentIntent with a PaymentMethod ID from the client.
	  const intent = await stripe.paymentIntents.create({
		amount: orderAmount,
		currency: currency,
		payment_method: paymentMethodId,
		error_on_requires_action: true,
		confirm: true
	  });
  
	  console.log("Payment received! Rs. " + orderAmount/100);
	  // The payment is complete and the money has been moved
	  // You can add any post-payment code here (e.g. shipping, fulfillment, etc)
  
	  // Send the client secret to the client to use in the demo
	  appointment.findById(app_id,function(err,foundappointment){
		  if(err){
			  console.log(err);
			  res.send({error: err});
		  } else {
			  foundappointment.paid = true;
			  foundappointment.save();
			  appointment.findById(foundappointment._id).populate("patientid").exec(function (err, patient) {
					if (err || !patient) {
						console.log(err)
						// res.redirect("back");
						res.send({error : err});
					} else {
						console.log(patient);
						var mailOptions = {
							from: 'pblvjti@gmail.com',
							to: patient.patientid.email,
							subject: 'Email for confirmation of Payment',
							text: `Your Payment is Successfull! You have paid ${foundappointment.billamount} to Dr.${foundappointment.doctorname}.`
						};

						console.log(mailOptions);
						transporter.sendMail(mailOptions, function (error, info) {
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}
						});
					}
				})
		  }
	  })
	  res.send({ clientSecret: intent.client_secret });
	} catch (e) {
	  // Handle "hard declines" e.g. insufficient funds, expired card, card authentication etc
	  // See https://stripe.com/docs/declines/codes for more
	  if (e.code === "authentication_required") {
		res.send({
		  error:
			"This card requires authentication in order to proceeded. Please use a different card."
		});
	  } else {
		console.log("in error");
		res.send({ error: e.message });
	  }
	}
  
  });

  app.get("/paymentsuccessful/:id",function(req,res){
	appointment.findById(req.params.id,function(err,foundappointment){
		if(err){
			console.log(err);
		} else {
			res.render("paymentsuccessful",{appointment : foundappointment} )
		} 
	});  
  });

app.post('/upload/:id', isLoggedIn, ispatient, function (req, res) {
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	var startup_image = req.files.foo;
	var fileName = `${req.body.fileName}_${req.params.id}.jpg`;
	// Use the mv() method to place the file somewhere on your server
	appointment.findById(req.params.id, function (err, foundappointment) {
		if (err || !foundappointment) {
			req.flash("error", "Appointment Not Found");
			res.redirect("back");
		} else {
			foundappointment.fileuploads.push(fileName);
			foundappointment.save();
			console.log(foundappointment);
		}
	});
	startup_image.mv(__dirname + '/images/' + fileName, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("uploaded");
		}
		res.redirect("back");
	});
});


app.get("/videoCall/:id", isLoggedIn, function (req, res) {
	console.log("idhar - ",req.user.type);
	res.render("videoCall", {
		id: req.params.id,
		type : req.user.type
	});
});

app.post('/chatBot', express.json(), (req, res) => {
	const agent = new dfff.WebhookClient({
		request: req,
		response: res
	});
	async function getDoctorDetails(agent) {
		const resp = await geocode(agent.context.get("location").parameters["location.original"]);
		const location = {
			x: resp.candidates[0].location.x,
			y: resp.candidates[0].location.y
		}
		var doctors = (await user.find({
			type: "doctor"
		})).sort(function (a, b) {
			return ((Number(a.loc.x) - Number(location.x)) ** 2 + (Number(a.loc.y) - Number(location.y)) ** 2) ** 0.5 -
				((Number(b.loc.x) - Number(location.x)) ** 2 + (Number(b.loc.y) - Number(location.y)) ** 2) ** 0.5;
		}).splice(0, 5);
		const response = await fetch('http://63c16f9db177.ngrok.io/predictdisease', {
			method: 'POST',
			body: JSON.stringify({
				symptoms: agent.context.get("symptoms").parameters["symptoms"].map(symptom => symptom.split(" ").join("_"))
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		try {
			const res = await response.json();
			console.log(res);
			var payloadData = {
				"richContent": [
					[{
						"type": "info",
						"title": `You might be suffering from ${res.result}.We have found the following doctors nearest to your location best treating the disease you are suffering from `,
					}],
					[...doctors.map(doctor => {
						return {
							"type": "accordion",
							"title": doctor.fname,
							"subtitle": doctor.lname,
							"image": {
								"src": {
									"rawUrl": doctor.image
								}
							},
							"text": doctor.description
						}
					})]
				]
			}
		} catch (err) {
			console.log(err);
			var payloadData = {
				"richContent": [
					[{
						"type": "info",
						"title": `I couldn 't understand you.'
												`,
					}]
				]
			}
		}
		agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, {
			sendAsMessage: true,
			rawPayload: true
		}))
	}

	async function shoWDoctorsTiming(agent) {
		try {
			var doctor = await user.findOne({
				type: "doctor",
				fname: agent.context.get("given-name").parameters["given-name"]
			});
			var payloadData = {
				"richContent": [
					[{
						"type": "info",
						"title": "The available timings are: ",
					}],
					[...doctor.schedule.map(schedule => {
						return {
							"type": "accordion",
							"title": `${schedule.day} ${schedule.from}: 00 - ${schedule.to}: 00 `,
						}
					})],
				]
			}
			console.log(agent.context.get("given-name"));
		} catch (err) {
			console.log(err);
			var payloadData = {
				"richContent": [
					[{
						"type": "info",
						"title": `I couldn't understand you.`,
					}]
				]
			}
		}
		agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, {
			sendAsMessage: true,
			rawPayload: true
		}))
	}
	async function bookappointment(agent) {
		try {
			var doctor = await user.findOne({
				type: "doctor",
				fname: agent.context.get("given-name").parameters["given-name"]
			});
			console.log(agent.context.get("date-time").parameters["date-time"]);
			var payloadData = {
				"richContent": [
					[{
						"type": "info",
						"title": "Click here to send Booking request",
						"image": {
							"src": {
								"rawUrl": "https://example.com/images/logo.png"
							}
						},
						"actionLink": `/doctors/${doctor._id}/bookappointment/${agent.context.get("date-time").parameters["date-time"].date_time}`
					}]
				]
			}
		} catch (err) {
			console.log(err);
			var payloadData = {
				"richContent": [
					[{
						"type": "info",
						"title": `I couldn't understand you.`,
					}]
				]
			}
		}
		agent.add(new dfff.Payload(agent.UNSPECIFIED, payloadData, {
			sendAsMessage: true,
			rawPayload: true
		}))
	}
	async function diet(agent) {
		try {
			var info = agent.context.get("phys_exercise").parameters["phys_exercise"];
			var requestBody = {
				name: "Mehdi",
				weight: agent.context.get("weight").parameters["weight"],
				height: agent.context.get("height").parameters["height"],
				age: agent.context.get("age").parameters["age"],
				gender: agent.context.get("gender").parameters["gender"],
				physical_activity: info,
			};

			console.log(requestBody);
			var responseData;

			const response = await fetch("http://63c16f9db177.ngrok.io/suggestdiet", {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json"
				},
			});
			const json = await response.json();
			console.log(json);
			var payloadData = {
				richContent: [
					[{
						type: "info",
						title: "Your recommended diet plan is: ",
					}, ],
					[{
							type: "list",
							title: "Breakfast",
							subtitle: json["breakfast"],
							event: {
								name: "",
								languageCode: "",
								parameters: {},
							},
						},
						{
							type: "divider",
						},
						{
							type: "list",
							title: "Snack 1",
							subtitle: json["snack1"],
							event: {
								name: "",
								languageCode: "",
								parameters: {},
							},
						},
						{
							type: "divider",
						},
						{
							type: "list",
							title: "Lunch",
							subtitle: json["lunch"],
							event: {
								name: "",
								languageCode: "",
								parameters: {},
							},
						},
						{
							type: "divider",
						},
						{
							type: "list",
							title: "Snack 2",
							subtitle: json["snack2"],
							event: {
								name: "",
								languageCode: "",
								parameters: {},
							},
						},
						{
							type: "divider",
						},
						{
							type: "list",
							title: "Dinner",
							subtitle: json["dinner"],
							event: {
								name: "",
								languageCode: "",
								parameters: {},
							},
						},
						{
							type: "divider",
						},
						{
							type: "list",
							title: "Snack 3",
							subtitle: json["snack3"],
							event: {
								name: "",
								languageCode: "",
								parameters: {},
							},
						},
					],
				],
			};
		} catch (err) {
			console.log(err);
			var payloadData = {
				"richContent": [
					[{
						"type": "info",
						"title": `I couldn't understand you.`,
					}]
				]
			}
		}

		agent.add(
			new dfff.Payload(agent.UNSPECIFIED, payloadData, {
				sendAsMessage: true,
				rawPayload: true,
			})
		);
	}

	async function covid(agent) {
		try {
			var country = agent.context.get('country').parameters['country'];
			var response = await fetch(`https://api.covid19api.com/live/country/${country}`);
			response = await response.json();
			console.log(response)
			var payloadData = {
				"richContent": [
					[{
						"type": "description",
						"title": response[0].Country,
						"text": [
							`Confirmed Cases in ${country} ${response.reduce((Confirmed,province)=>Confirmed+province.Confirmed,0)}`,
							`Confirmed Deaths in ${country} ${response.reduce((Deaths,province)=>Deaths+province.Deaths,0)}`,
							`Confirmed Recovered in ${country} ${response.reduce((Recovered,province)=>Recovered+province.Recovered,0)}`,
							`Confirmed Active in ${country} ${response.reduce((Active,province)=>Active+province.Active,0)}`,
						]
					}]
				]
			}
		} catch (err) {
			console.log(err);
			var payloadData = {
				"richContent": [
					[{
						"type": "info",
						"title": `I couldn't understand you.'`,
					}]
				]
			}
		}
		agent.add(
			new dfff.Payload(agent.UNSPECIFIED, payloadData, {
				sendAsMessage: true,
				rawPayload: true,
			})
		);
	}

	function defaultFallback(agent) {
		agent.add(
			"Sorry! I am unable to understand this at the moment. I am still learning humans. You can pick any of the service that might help me."
		);
	}
	var intentMap = new Map();
	intentMap.set("add_location", getDoctorDetails);
	intentMap.set("show_doctors_timing", shoWDoctorsTiming);
	intentMap.set("confirm_time", bookappointment);
	intentMap.set("ask physical exercise", diet);
	intentMap.set("Default Fallback Intent", defaultFallback);
	intentMap.set("Covid", covid);
	agent.handleRequest(intentMap);
});


// CHAT FUNCTIONALITY
// CHAT FINISHES

app.get("/*", function (req, res) {
	req.flash("error", "Error 404! The page you are looking for is not found.");
	res.redirect("/");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You Need To Login To Perform That");
	res.redirect("/signin");
}

function nouser(req, res, next) {
	if (!req.user) {
		return next();
	}
	req.flash("error", "You Need To Log Out First");
	res.redirect("back");
}

function isdoctor(req, res, next) {
	if (req.user.type == "doctor") {
		return next();
	}
	req.flash("info", "Only Doctors Can Access That Page");
	res.redirect("back");
}

function nodoctordes(req, res, next) {
	if (req.user.type == "doctor" && !req.user.description) {
		return next();
	}
	req.flash("info", "You Already Have Filled Description");
	res.redirect("back");
}

function ispatient(req, res, next) {
	if (req.user.type == "patient") {
		return next();
	}
	req.flash("info", "Only Doctors Can Access That Page");
	res.redirect("back");
}

function isadmin(req, res, next) {
	if (req.user.type == "admin") {
		return next();
	}
	req.flash("info", "Only Admins Can Access That Page");
	res.redirect("back");
}

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.listen(process.env.PORT || 3000, function () {
	console.log("The Clinicapp Server Has Started!");
});
