/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const chai = require("chai");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { findMarkup, decodeXmlEntities, scanSchemaXml, scanLocalizationJson, validateMarkup } = require("../MarkupValidation");

const expect = chai.expect;

function schemaXml(attributes) {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <ECSchema schemaName="TestSchema" alias="ts" version="01.00.00" xmlns="http://www.bentley.com/schemas/Bentley.ECXML.3.2" ${attributes.schema || ""}>
            <ECEntityClass typeName="Thing" ${attributes.class || ""}>
                <ECProperty propertyName="Prop" typeName="string" ${attributes.property || ""}/>
            </ECEntityClass>
        </ECSchema>`;
        }

describe("Markup validation of schema free text", function () {

    describe("findMarkup", function () {
        it("accepts the placeholder conventions already used in released schemas", function () {
            expect(findMarkup("<None>")).to.be.undefined;
            expect(findMarkup("<none>")).to.be.undefined;
            expect(findMarkup("<General> [Drainage]")).to.be.undefined;
            expect(findMarkup("<- TotalLength ->")).to.be.undefined;
            expect(findMarkup("<PrimarySchemaName>_Supplemental_<Purpose>")).to.be.undefined;
            expect(findMarkup("Length < Width and Height > Depth")).to.be.undefined;
            expect(findMarkup("")).to.be.undefined;
            expect(findMarkup(undefined)).to.be.undefined;
        });

        it("rejects HTML elements regardless of casing or attributes", function () {
            expect(findMarkup("<script>alert(1)</script>")).to.contain("HTML element");
            expect(findMarkup("<SCRIPT src=x>")).to.contain("HTML element");
            expect(findMarkup("<img\tsrc=x>")).to.contain("HTML element");
            expect(findMarkup("text <details><summary>x</summary></details>")).to.contain("HTML element");
            expect(findMarkup("<a href='https://example.com'>link</a>")).to.contain("HTML element");
            expect(findMarkup("<svg/onload=alert(1)>")).to.contain("HTML element");
            expect(findMarkup("</div>")).to.contain("HTML element");
            expect(findMarkup("<iframe")).to.contain("HTML element");
        });

        it("treats '< tag' with a space as text, like browsers do, but still catches handlers on it", function () {
            expect(findMarkup("a < b and c > d")).to.be.undefined;
            expect(findMarkup("< p >")).to.be.undefined;
            expect(findMarkup("< img src=x onerror=alert(1)>")).to.contain("inline event handler");
        });

        it("does not confuse identifiers that merely start with an HTML tag name", function () {
            expect(findMarkup("<address_line>")).to.be.undefined;
            expect(findMarkup("<p1>")).to.be.undefined;
            expect(findMarkup("<- Balance ->")).to.be.undefined;
            expect(findMarkup("<Bearing>")).to.be.undefined;
        });

        it("rejects event handlers, script URIs, comments and processing instructions", function () {
            expect(findMarkup("x onerror=alert(1)")).to.contain("inline event handler");
            expect(findMarkup("x onload = foo")).to.contain("inline event handler");
            expect(findMarkup("see javascript:alert(1)")).to.contain("javascript: URI");
            expect(findMarkup("JavaScript :alert(1)")).to.contain("javascript: URI");
            expect(findMarkup("vbscript:msgbox")).to.contain("vbscript: URI");
            expect(findMarkup("data:text/html;base64,AAAA")).to.contain("data:text/html URI");
            expect(findMarkup("<!-- hidden -->")).to.contain("HTML comment");
            expect(findMarkup("<?php echo 1 ?>")).to.contain("processing instruction");
        });

        it("does not flag ordinary words containing 'on'", function () {
            expect(findMarkup("Construction = complete")).to.be.undefined;
            expect(findMarkup("The station=5 is one of many")).to.be.undefined;
            expect(findMarkup("Elevation=10")).to.be.undefined;
        });

        it("rejects attributes on unknown/custom elements that are not in the HTML tag list", function () {
            expect(findMarkup("<x-widget style='position:fixed'>")).to.contain("element with attributes");
            expect(findMarkup("<foo href=\"https://evil\">")).to.contain("element with attributes");
            expect(findMarkup("<None>")).to.be.undefined;
            expect(findMarkup("<- TotalLength ->")).to.be.undefined;
            expect(findMarkup("if a < b = c")).to.be.undefined;
        });

        it("rejects double-encoded character references that an HTML renderer would decode again", function () {
            expect(findMarkup("javascript&#58;alert(1)")).to.contain("double-encoded character reference");
            expect(findMarkup("&#x3C;script&#x3E;")).to.contain("double-encoded character reference");
            expect(findMarkup("&lt;b&gt;")).to.contain("double-encoded character reference");
            expect(findMarkup("&colon;")).to.contain("double-encoded character reference");
            expect(findMarkup("R&D and Bugs & Daffy")).to.be.undefined;
            expect(findMarkup("a & b; c")).to.be.undefined;
        });
    });

    describe("decodeXmlEntities", function () {
        it("decodes named, decimal and hex references", function () {
            expect(decodeXmlEntities("&lt;b&gt;")).to.equal("<b>");
            expect(decodeXmlEntities("&#60;b&#62;")).to.equal("<b>");
            expect(decodeXmlEntities("&#x3C;b&#X3E;")).to.equal("<b>");
            expect(decodeXmlEntities("Bugs &amp; Daffy &quot;x&quot; &apos;y&apos;")).to.equal("Bugs & Daffy \"x\" 'y'");
        });

        it("does not double-decode", function () {
            expect(decodeXmlEntities("&amp;lt;b&amp;gt;")).to.equal("&lt;b&gt;");
        });
    });

    describe("file scanning", function () {
        let tempRoot;

        beforeEach(() => {
            tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "bis-markup-"));
        });

        afterEach(() => {
            fs.rmSync(tempRoot, { recursive: true, force: true });
        });

        function write(relativePath, content) {
            const fullPath = path.join(tempRoot, relativePath);
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, content);
            return fullPath;
        }

        it("reports entity-encoded markup in description and displayLabel attributes with line numbers", function () {
            const file = write("Domains/Test/Test.ecschema.xml", schemaXml({
            schema: `description="Safe &lt;None&gt; text"`,
            class: `displayLabel="&lt;img src=x onerror=alert(1)&gt;" description="ok"`,
            property: `description="&lt;script&gt;alert(1)&lt;/script&gt;"`,
            }));

            const findings = scanSchemaXml(file);
            expect(findings).to.have.lengthOf(2);
            expect(findings[0]).to.include({ line: 3, field: "displayLabel" });
            expect(findings[1]).to.include({ line: 4, field: "description" });
        });

        it("supports single-quoted attributes", function () {
            const file = write("Test.ecschema.xml", schemaXml({ class: `description='&lt;b&gt;bold&lt;/b&gt;'` }));
            expect(scanSchemaXml(file)).to.have.lengthOf(1);
        });

        it("ignores attributes that are not free text", function () {
            const file = write("Test.ecschema.xml", schemaXml({ class: `modifier="Sealed" description="fine"` }));
            expect(scanSchemaXml(file)).to.have.lengthOf(0);
        });

        it("checks the other free-text attributes that ecjson2md writes to the docs", function () {
            const file = write("Test.ecschema.xml", `<?xml version="1.0" encoding="UTF-8"?>
                <ECSchema schemaName="TestSchema" alias="ts" version="01.00.00" xmlns="http://www.bentley.com/schemas/Bentley.ECXML.3.2">
                    <ECRelationshipClass typeName="Rel" strength="referencing" modifier="None">
                        <Source multiplicity="(0..*)" roleLabel="&lt;img src=x onerror=alert(1)&gt;" polymorphic="true"><Class class="A"/></Source>
                        <Target multiplicity="(0..*)" roleLabel="is owned by" polymorphic="true"><Class class="B"/></Target>
                    </ECRelationshipClass>
                    <Unit typeName="U" phenomenon="P" unitSystem="S" definition="&lt;script&gt;M&lt;/script&gt;" displayLabel="m"/>
                    <Phenomenon typeName="P" definition="LENGTH" displayLabel="Length"/>
                    <Format typeName="F" type="decimal" precision="4" uomSeparator="&lt;b&gt;"/>
                    <KindOfQuantity typeName="K" persistenceUnit="U" presentationUnits="f:F[U|&lt;svg onload=alert(1)&gt;]" relativeError="0.01"/>
                    <ECEntityClass typeName="A"><ECProperty propertyName="P" typeName="string" extendedTypeName="&lt;iframe&gt;"/></ECEntityClass>
                </ECSchema>`);

            const findings = scanSchemaXml(file);
            expect(findings.map((f) => f.field)).to.have.members(["roleLabel", "definition", "uomSeparator", "presentationUnits", "extendedTypeName"]);
            expect(findings.map((f) => f.line)).to.have.members([4, 7, 9, 10, 11]);
        });

        it("checks the Description text of a CoreCustomAttributes.Deprecated instance", function () {
            const file = write("Test.ecschema.xml", `<?xml version="1.0" encoding="UTF-8"?>
                <ECSchema schemaName="TestSchema" alias="ts" version="01.00.00" xmlns="http://www.bentley.com/schemas/Bentley.ECXML.3.2">
                    <ECEntityClass typeName="Old">
                        <ECCustomAttributes>
                            <Deprecated xmlns="CoreCustomAttributes.01.00.03">
                                <Description>Use &lt;a href="javascript:alert(1)"&gt;New&lt;/a&gt; instead.</Description>
                            </Deprecated>
                        </ECCustomAttributes>
                        <ECProperty propertyName="Description" typeName="string" description="A plain property called Description"/>
                    </ECEntityClass>
                    <ECStructClass typeName="Other">
                        <ECProperty propertyName="X" typeName="string"/>
                    </ECStructClass>
                </ECSchema>`);

            const findings = scanSchemaXml(file);
            expect(findings).to.have.lengthOf(1);
            expect(findings[0]).to.include({ line: 6, field: "Deprecated.Description" });
        });

        it("does not treat <Description> elements outside a Deprecated attribute as free text", function () {
            const file = write("Test.ecschema.xml", `<ECSchema>
                <SomeOtherCA><Description>&lt;b&gt;not checked&lt;/b&gt;</Description></SomeOtherCA>
            </ECSchema>`);
            expect(scanSchemaXml(file)).to.have.lengthOf(0);
        });

        it("catches attribute values and Deprecated descriptions that span multiple lines", function () {
            const file = write("Test.ecschema.xml", `<ECSchema schemaName="S">
                <ECEntityClass typeName="A" description="first line
                second line &lt;script&gt;alert(1)&lt;/script&gt;
                third line"/>
                    <ECEntityClass typeName="B">
                        <ECCustomAttributes>
                            <Deprecated xmlns="CoreCustomAttributes.01.00.03">
                                <Description>
                                    Use B2 instead.
                                    &lt;img src=x onerror=alert(1)&gt;
                                </Description>
                            </Deprecated>
                        </ECCustomAttributes>
                    </ECEntityClass>
                </ECSchema>`);

            const findings = scanSchemaXml(file);
            expect(findings).to.have.lengthOf(2);
            expect(findings[0]).to.include({ line: 2, field: "description" });
            expect(findings[1]).to.include({ line: 8, field: "Deprecated.Description" });
        });

        it("handles a self-closing Deprecated attribute followed by an unrelated Description element", function () {
            const file = write("Test.ecschema.xml", `<ECSchema schemaName="S">
                <ECEntityClass typeName="A"><ECCustomAttributes><Deprecated xmlns="CoreCustomAttributes.01.00.03"/></ECCustomAttributes></ECEntityClass>
                <ECEntityClass typeName="B"><ECCustomAttributes><Other><Description>&lt;b&gt;</Description></Other></ECCustomAttributes></ECEntityClass>
            </ECSchema>`);
            expect(scanSchemaXml(file)).to.have.lengthOf(0);
        });

        it("reports markup in localization json label and description values", function () {
            const file = write("Domains/Test/Locales/Test.de.json", JSON.stringify({
            $schema: "ecschema-localization-v1",
            version: "01.00.00",
            label: "Fine <None>",
            description: "<a href='javascript:alert(1)'>x</a>",
            items: { Thing: { label: "ok", description: "ok", properties: { Prop: { label: "<iframe src=x>", description: "ok" } } } },
        }));

        const findings = scanLocalizationJson(file);
        expect(findings).to.have.lengthOf(2);
        expect(findings[0].field).to.equal("description");
        expect(findings[1].field).to.equal("items.Thing.properties.Prop.label");
        });

        it("tolerates malformed localization json (reported elsewhere)", function () {
            const file = write("Locales/Test.de.json", "{ not json");
            expect(scanLocalizationJson(file)).to.have.lengthOf(0);
        });

        it("validateMarkup passes for clean repositories and skips tooling directories only at the root", function () {
            write("Domains/A/A.ecschema.xml", schemaXml({ class: `description="&lt;None&gt;"` }));
            write("System/B.ecschema.xml", schemaXml({}));
            write("Domains/A/Locales/A.de.json", JSON.stringify({ label: "ok" }));
            write("Domains/A/Other.json", JSON.stringify({ label: "<script>not scanned, not a locale</script>" }));
            write("tools/x/test/assets/Evil.ecschema.xml", schemaXml({ class: `description="&lt;script&gt;"` }));
            write("node_modules/pkg/Evil.ecschema.xml", schemaXml({ class: `description="&lt;script&gt;"` }));
            write("Domains/A/node_modules/Evil.ecschema.xml", schemaXml({ class: `description="&lt;script&gt;"` }));

            expect(validateMarkup(tempRoot)).to.equal(3);
        });

        it("validateMarkup does not let a schema hide in a nested folder named like a skipped directory", function () {
            write("Domains/A/test/Released/Evil.01.00.00.ecschema.xml", schemaXml({ class: `description="&lt;script&gt;"` }));
            write("Domains/B/tools/Evil.ecschema.xml", schemaXml({ class: `description="&lt;img src=x&gt;"` }));

            expect(() => validateMarkup(tempRoot)).to.throw(Error)
            .with.property("message")
            .that.contains("Evil.01.00.00.ecschema.xml")
            .and.contains(path.join("Domains", "B", "tools", "Evil.ecschema.xml"));
        });

        it("validateMarkup throws listing every offending location", function () {
            write("Domains/A/A.ecschema.xml", schemaXml({ class: `description="&lt;script&gt;"`, property: `displayLabel="&lt;b&gt;"` }));
            write("Domains/A/Locales/A.de.json", JSON.stringify({ label: "<img src=x>" }));

            expect(() => validateMarkup(tempRoot)).to.throw(Error)
            .with.property("message")
            .that.contains("A.ecschema.xml:3 - description")
            .and.contains("A.ecschema.xml:4 - displayLabel")
            .and.contains("A.de.json - label");
        });
    });

    describe("repository schemas", function () {
        it("contain no HTML markup in descriptions or labels", function () {
            this.timeout(60000);
            const bisRoot = path.join(__dirname, "../../../");
            expect(() => validateMarkup(bisRoot)).to.not.throw();
        });
    });
});
