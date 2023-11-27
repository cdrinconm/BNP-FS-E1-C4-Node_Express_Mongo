var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');

describe("Testing Bicicletas", function(){
    beforeEach((done)=>{
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, {useNewUrlParser: true})

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error: '));
        db.once('open', function() {
            console.log('We are connected to test database!');
            done();
        });
    });

    afterEach(function(done){
        Bicicleta.deleteMany({}).then(function(err, success){
            if (err) console.log(err);
            mongoose.disconnect(err);
            done();
        });
    });

    describe("Bicicleta.createInstance", () => {
        it("crea una instancia de Bicicleta", function() {    
            var bici = Bicicleta.createInstance(1, 'verde', 'urbana', [-34.5,-54.1]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe('verde');
            expect(bici.modelo).toBe('urbana');
            expect(bici.ubicacion[0]).toBe(-34.5);
            expect(bici.ubicacion[1]).toBe(-54.1);
        });
    });

    describe("Bicicleta.allBicis", () => {
        it("comienza vacia", (done) => {
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe("Bicicleta.add", () => {
        it("agrega solo una bici", (done) => {
            var aBici = new Bicicleta({code:1, color:'verde', modelo:'urbana'});
            Bicicleta.add(aBici, function(err,newBici){
                if (err) console.log(err);
                Bicicleta.allBicis(function(err,bicis){
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);

                    done();
                });
            });
        });
    });

    describe("Bicicleta.findByCode", () => {
        it("debe devolver la bici con code 1", (done) => {
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0);
                
                var aBici = new Bicicleta({code:1, color:'verde', modelo:'urbana'});
                Bicicleta.add(aBici, function(err,newBici){
                    if (err) console.log(err);

                    var aBici2 = new Bicicleta({code:2, color:'roja', modelo:'urbana'});
                    Bicicleta.add(aBici2, function(err,newBici){
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, function(err,targetBici){
                            expect(targetBici.code).toEqual(aBici.code);
                            expect(targetBici.color).toEqual(aBici.color);
                            expect(targetBici.modelo).toEqual(aBici.modelo);
    
                            done();
                        });
                    });
                });
            });
        });
    });
    
});


/*
beforeEach(()=>{Bicicleta.allBicis = []});

describe("Bicicleta.allBicis", () => {
    it("comienza vacia", function() {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe("Bicicleta.add", () => {
    it("agregamos una", function() {
        expect(Bicicleta.allBicis.length).toBe(0);
        var a = new Bicicleta(1, 'rojo', 'urbana', [4.648874, -74.086404]);
        Bicicleta.add(a);
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe("Bicicleta.findById", () => {
    it("debe devolver la bici con id: 1", function() {

        expect(Bicicleta.allBicis.length).toBe(0);
        var aBici = new Bicicleta(1, 'rojo', 'urbana');
        var aBici2 = new Bicicleta(2, 'rojo', 'urbana');
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);

        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);
    });
});*/