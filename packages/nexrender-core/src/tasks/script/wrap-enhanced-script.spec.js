const chai = require('chai')
const expect = chai.expect
const fs = require('node:fs')
const path = require('node:path')
const os = require("node:os");
const wrapEnhancedScript = require("./wrap-enhanced-script");
const {  before } = require('mocha');


describe("tasks/script/wrap-enhanced-script", () => {
    const tempScriptPath = path.join(os.tmpdir(), 'unittest.jsx')
    before(() => {
        fs.writeFileSync(tempScriptPath,`
            return {
                nxWorkpath: NX.get('nxWorkpath'),
                nxUID: NX.get('nxUID')
            }
        `);
    })
    it("Esnure build-in parameters are added", () => {
       const enhancedScript =  wrapEnhancedScript({
            workpath: "/tmp",
            uid: "12345"
        }, {
            logger: { log: () => {} },
        }, {
            dest: tempScriptPath,
            src: "src",
            parameters: [],
            keyword: "NX",
            defaults: {}
        })
        expect(enhancedScript).to.contain(`NX.set('nxWorkpath', "/tmp")`)
        expect(enhancedScript).to.contain(`NX.set('nxUID', "12345")`)

        const evaluatedResult = eval(enhancedScript)
        expect(evaluatedResult.nxWorkpath).to.equal('/tmp')
        expect(evaluatedResult.nxUID).to.equal('12345')
    });


})
