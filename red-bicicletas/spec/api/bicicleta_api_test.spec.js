var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

var base_url = "http://localhost:5000/api/bicicletas";


describe ("Bicicleta API", () => {
    beforeEach(function(done){
        var  mongoDB = 'mongodb://localhost/red_bicicletas';
        mongoose.connect(mongoDB, { useNewUrlParser: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console,'connection error'));
        db.once('open', function() {
            console.log('We are connected to test database!');
            done();
        });
    });

    afterEach(function (done) {
        Bicicleta.deleteMany({},function (err, success) {
            if(err) console.log(err);
            done();          
        });
    });

    describe("POST BICICLETA /create", () => {
        it("status 200",(done) =>{
            var headers = {'content-type' : 'application/json'};
            var aBici = '{"code":10, "color": "rojo", "modelo":"urbana", "lat":8.16, "lng": -80.95}';
            request.post({
                headers: headers,
                url: base_url + '/create',
                body: aBici
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).Bicicleta;
                console.log(bici);
                expect(bici.color).toBe("rojo");
                expect(bici.ubicacion[0]).toBe(8.16);
                expect(bici.ubicacion[1]).toBe(-80.95);
                done();
            });
        });

    });
});
/*
beforeEach(()=>{Bicicleta.allBicis = []});

beforeEach(()=>{console.log('testeando...')});

describe("Bicicleta API", () => {
    describe("GET BICICLETAS /", () => {
        it("Status 200", () => {
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1, 'rojo', 'urbana', [4.648874, -74.086404]);
            Bicicleta.add(a);

            request.get('http://localhost:5000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            })
        });
    });

    describe("POST BICICLETAS /create", () => {
        it("STATUS 200", (done) => {
            var headers = {'content-type':'application/json'};
            var aBici = '{"id":10, "color":"rojo", "modelo":"urbana", "lat":-34, "lng":-54}';
            request.post({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/create',
                body: aBici
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(10).color).toBe('rojo');
                done();
            })
        });
    });

    describe("DELETE BICICLETAS /delete", () => {
        it("STATUS 200", (done) => {
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1, 'rojo', 'urbana', [4.648874, -74.086404]);
            Bicicleta.add(a);

            var headers = {'content-type':'application/json'};
            var aBici = '{"id":1}';
            request.delete({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/delete',
                body: aBici
            }, function(error, response, body){
                expect(response.statusCode).toBe(204);
                expect(Bicicleta.allBicis.length).toBe(0);
                done();
            })
        });
    });
});*/