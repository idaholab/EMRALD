// Copyright 2021 Battelle Energy Alliance

/// <reference path="handler.d.ts" />

//declare module mxGraphModule {

interface mxCodecRegistry {

    codecs: any[];
    aliases: any[];
    register(codec: mxObjectCodec): mxObjectCodec;
    addAlias(classname: string, codecname: string);
    getCodec(ctor: ICallback): mxObjectCodec;

}

declare var mxCodecRegistry: {
    new (): mxCodecRegistry;
    prototype: mxCodecRegistry;
}

interface mxCodec {

    /**
     * Variable: document
     *
     * The owner document of the codec.
     */
    document: any;
    /**
     * Variable: objects
     *
     * Maps from IDs to objects.
     */
    objects: any[];
    /**
     * Variable: encodeDefaults
     *
     * Specifies if default values should be encoded. Default is false.
     */
    encodeDefaults: boolean;
    /**
     * Function: putObject
     * 
     * Assoiates the given object with the given ID and returns the given object.
     * 
     * Parameters
     * 
     * id - ID for the object to be associated with.
     * obj - Object to be associated with the ID.
     */
    putObject(id: string, obj: Object): Object;
    /**
     * Function: getObject
     *
     * Returns the decoded object for the element with the specified ID in
     * <document>. If the object is not known then <lookup> is used to find an
     * object. If no object is found, then the element with the respective ID
     * from the document is parsed using <decode>.
     */
    getObject(id: string): Object;
    /**
     * Function: lookup
     *
     * Hook for subclassers to implement a custom lookup mechanism for cell IDs.
     * This implementation always returns null.
     *
     * Example:
     *
     * (code)
     * var codec = new mxCodec();
     * codec.lookup = function(id)
     * {
     *   return model.getCell(id);
     * };
     * (end)
     *
     * Parameters:
     *
     * id - ID of the object to be returned.
     */
    lookup(id: string): any;
    /**
     * Function: getElementById
     *
     * Returns the element with the given ID from <document>. The optional attr
     * argument specifies the name of the ID attribute. Default is "id". The
     * XPath expression used to find the element is //*[@attr='arg'] where attr is
     * the name of the ID attribute and arg is the given id.
     *
     * Parameters:
     *
     * id - String that contains the ID.
     * attr - Optional string for the attributename. Default is "id".
     */
    getElementById(id: string, attr?: string): Element;
    /**
     * Function: getId
     *
     * Returns the ID of the specified object. This implementation
     * calls <reference> first and if that returns null handles
     * the object as an <mxCell> by returning their IDs using
     * <mxCell.getId>. If no ID exists for the given cell, then
     * an on-the-fly ID is generated using <mxCellPath.create>.
     *
     * Parameters:
     *
     * obj - Object to return the ID for.
     */
    getId(obj: Object): string;
    /**
     * Function: reference
     *
     * Hook for subclassers to implement a custom method
     * for retrieving IDs from objects. This implementation
     * always returns null.
     *
     * Example:
     *
     * (code)
     * var codec = new mxCodec();
     * codec.reference = function(obj)
     * {
     *   return obj.getCustomId();
     * };
     * (end)
     *
     * Parameters:
     *
     * obj - Object whose ID should be returned.
     */
    reference(obj: Object): any;
    /**
     * Function: encode
     *
     * Encodes the specified object and returns the resulting
     * XML node.
     *
     * Parameters:
     *
     * obj - Object to be encoded. 
     */
    encode(obj: Object): Element;
    /**
     * Function: decode
     *
     * Decodes the given XML node. The optional "into"
     * argument specifies an existing object to be
     * used. If no object is given, then a new instance
     * is created using the constructor from the codec.
     *
     * The function returns the passed in object or
     * the new instance if no object was given.
     *
     * Parameters:
     *
     * node - XML node to be decoded.
     * into - Optional object to be decodec into.
     */
    decode(node: Element, into?: Object): Object;
    /**
     * Function: encodeCell
     *
     * Encoding of cell hierarchies is built-into the core, but
     * is a higher-level function that needs to be explicitely
     * used by the respective object encoders (eg. <mxModelCodec>,
     * <mxChildChangeCodec> and <mxRootChangeCodec>). This
     * implementation writes the given cell and its children as a
     * (flat) sequence into the given node. The children are not
     * encoded if the optional includeChildren is false. The
     * function is in charge of adding the result into the
     * given node and has no return value.
     *
     * Parameters:
     *
     * cell - <mxCell> to be encoded.
     * node - Parent XML node to add the encoded cell into.
     * includeChildren - Optional boolean indicating if the
     * function should include all descendents. Default is true. 
     */
    encodeCell(cell: mxCell, node: Element, includeChildren?: boolean);
    /**
     * Function: isCellCodec
     * 
     * Returns true if the given codec is a cell codec. This uses
     * <mxCellCodec.isCellCodec> to check if the codec is of the
     * given type.
     */
    isCellCodec(codec: Object): boolean;
    /**
     * Function: decodeCell
     *
     * Decodes cells that have been encoded using inversion, ie.
     * where the user object is the enclosing node in the XML,
     * and restores the group and graph structure in the cells.
     * Returns a new <mxCell> instance that represents the
     * given node.
     *
     * Parameters:
     *
     * node - XML node that contains the cell data.
     * restoreStructures - Optional boolean indicating whether
     * the graph structure should be restored by calling insert
     * and insertEdge on the parent and terminals, respectively.
     * Default is true.
     */
    decodeCell(node: Element, restoreStructures?: boolean): mxCell;
    /**
     * Function: insertIntoGraph
     *
     * Inserts the given cell into its parent and terminal cells.
     */
    insertIntoGraph(cell: mxCell);
    /**
     * Function: setAttribute
     *
     * Sets the attribute on the specified node to value. This is a
     * helper method that makes sure the attribute and value arguments
     * are not null.
     *
     * Parameters:
     *
     * node - XML node to set the attribute for.
     * attributes - Attributename to be set.
     * value - New value of the attribute.
     */
    setAttribute(node: Element, attribute: string, value: any);

}

declare var mxCodec: {
    new (document?: Element): mxCodec;
    prototype: mxCodec;
}

interface mxObjectCodec {

    /**
     * Variable: template
     *
     * Holds the template object associated with this codec.
     */
    template: Object;
    /**
     * Variable: exclude
     *
     * Array containing the variable names that should be
     * ignored by the codec.
     */
    exclude: any[];
    /**
     * Variable: idrefs
     *
     * Array containing the variable names that should be
     * turned into or converted from references. See
     * <mxCodec.getId> and <mxCodec.getObject>.
     */
    idrefs: any[];
    /**
     * Variable: mapping
     *
     * Maps from from fieldnames to XML attribute names.
     */
    mapping: any[];
    /**
     * Variable: reverse
     *
     * Maps from from XML attribute names to fieldnames.
     */
    reverse: any[];
    /**
     * Function: getName
     * 
     * Returns the name used for the nodenames and lookup of the codec when
     * classes are encoded and nodes are decoded. For classes to work with
     * this the codec registry automatically adds an alias for the classname
     * if that is different than what this returns. The default implementation
     * returns the classname of the template class.
     */
    getName(): string;
    /**
     * Function: cloneTemplate
     * 
     * Returns a new instance of the template for this codec.
     */
    cloneTemplate(): any;
    /**
     * Function: getFieldName
     * 
     * Returns the fieldname for the given attributename.
     * Looks up the value in the <reverse> mapping or returns
     * the input if there is no reverse mapping for the
     * given name.
     */
    getFieldName(attributename: string): string;
    /**
     * Function: getAttributeName
     * 
     * Returns the attributename for the given fieldname.
     * Looks up the value in the <mapping> or returns
     * the input if there is no mapping for the
     * given name.
     */
    getAttributeName(fieldname: string): string;
    /**
     * Function: isExcluded
     *
     * Returns true if the given attribute is to be ignored by the codec. This
     * implementation returns true if the given fieldname is in <exclude> or
     * if the fieldname equals <mxObjectIdentity.FIELD_NAME>.
     *
     * Parameters:
     *
     * obj - Object instance that contains the field.
     * attr - Fieldname of the field.
     * value - Value of the field.
     * write - Boolean indicating if the field is being encoded or decoded.
     * Write is true if the field is being encoded, else it is being decoded.
     */
    isExcluded(obj: Object, attr: string, value: any, write: boolean): boolean;
    /**
     * Function: isReference
     *
     * Returns true if the given fieldname is to be treated
     * as a textual reference (ID). This implementation returns
     * true if the given fieldname is in <idrefs>.
     *
     * Parameters:
     *
     * obj - Object instance that contains the field.
     * attr - Fieldname of the field.
     * value - Value of the field. 
     * write - Boolean indicating if the field is being encoded or decoded.
     * Write is true if the field is being encoded, else it is being decoded.
     */
    isReference(obj: Object, attr: string, value: any, write: boolean): boolean;
    /**
     * Function: encode
     *
     * Encodes the specified object and returns a node
     * representing then given object. Calls <beforeEncode>
     * after creating the node and <afterEncode> with the 
     * resulting node after processing.
     *
     * Enc is a reference to the calling encoder. It is used
     * to encode complex objects and create references.
     *
     * This implementation encodes all variables of an
     * object according to the following rules:
     *
     * - If the variable name is in <exclude> then it is ignored.
     * - If the variable name is in <idrefs> then <mxCodec.getId>
     * is used to replace the object with its ID.
     * - The variable name is mapped using <mapping>.
     * - If obj is an array and the variable name is numeric
     * (ie. an index) then it is not encoded.
     * - If the value is an object, then the codec is used to
     * create a child node with the variable name encoded into
     * the "as" attribute.
     * - Else, if <encodeDefaults> is true or the value differs
     * from the template value, then ...
     * - ... if obj is not an array, then the value is mapped to
     * an attribute.
     * - ... else if obj is an array, the value is mapped to an
     * add child with a value attribute or a text child node,
     * if the value is a function.
     *
     * If no ID exists for a variable in <idrefs> or if an object
     * cannot be encoded, a warning is issued using <mxLog.warn>.
     *
     * Returns the resulting XML node that represents the given
     * object.
     *
     * Parameters:
     *
     * enc - <mxCodec> that controls the encoding process.
     * obj - Object to be encoded.
     */
    encode(enc: mxCodec, obj: Object): Element;
    /**
     * Function: encodeObject
     *
     * Encodes the value of each member in then given obj into the given node using
     * <encodeValue>.
     * 
     * Parameters:
     *
     * enc - <mxCodec> that controls the encoding process.
     * obj - Object to be encoded.
     * node - XML node that contains the encoded object.
     */
    encodeObject(enc: mxCodec, obj: Object, node: Element);
    /**
     * Function: encodeValue
     * 
     * Converts the given value according to the mappings
     * and id-refs in this codec and uses <writeAttribute>
     * to write the attribute into the given node.
     * 
     * Parameters:
     *
     * enc - <mxCodec> that controls the encoding process.
     * obj - Object whose property is going to be encoded.
     * name - XML node that contains the encoded object.
     * value - Value of the property to be encoded.
     * node - XML node that contains the encoded object.
     */
    encodeValue(enc: mxCodec, obj: Object, name: string, value: any, node: Element);
    /**
     * Function: writeAttribute
     * 
     * Writes the given value into node using <writePrimitiveAttribute>
     * or <writeComplexAttribute> depending on the type of the value.
     */
    writeAttribute(enc: mxCodec, obj: Object, name: string, value: any, node: Element);
    /**
     * Function: writePrimitiveAttribute
     * 
     * Writes the given value as an attribute of the given node.
     */
    writePrimitiveAttribute(enc: mxCodec, obj: Object, name: string, value: any, node: Element);
    /**
     * Function: writeComplexAttribute
     * 
     * Writes the given value as a child node of the given node.
     */
    writeComplexAttribute(enc: mxCodec, obj: Object, name: string, value: any, node: Element);
    /**
     * Function: convertAttributeToXml
     * 
     * Converts true to "1" and false to "0" is <isBooleanAttribute> returns true.
     * All other values are not converted.
     * 
     * Parameters:
     *
     * enc - <mxCodec> that controls the encoding process.
     * obj - Objec to convert the attribute for.
     * name - Name of the attribute to be converted.
     * value - Value to be converted.
     */
    convertAttributeToXml(enc: mxCodec, obj: Object, name: string, value: any): any;
    /**
     * Function: isBooleanAttribute
     * 
     * Returns true if the given object attribute is a boolean value.
     * 
     * Parameters:
     *
     * enc - <mxCodec> that controls the encoding process.
     * obj - Objec to convert the attribute for.
     * name - Name of the attribute to be converted.
     * value - Value of the attribute to be converted.
     */
    isBooleanAttribute(enc: mxCodec, obj: Object, name: string, value: any): boolean;
    /**
     * Function: convertAttributeFromXml
     * 
     * Converts booleans and numeric values to the respective types. Values are
     * numeric if <isNumericAttribute> returns true.
     * 
     * Parameters:
     *
     * dec - <mxCodec> that controls the decoding process.
     * attr - XML attribute to be converted.
     * obj - Objec to convert the attribute for.
     */
    convertAttributeFromXml(dec: mxCodec, attr: any, obj: Object): any;
    /**
     * Function: isNumericAttribute
     * 
     * Returns true if the given XML attribute is a numeric value.
     * 
     * Parameters:
     *
     * dec - <mxCodec> that controls the decoding process.
     * attr - XML attribute to be converted.
     * obj - Objec to convert the attribute for.
     */
    isNumericAttribute(dec: mxCodec, attr: any, obj: Object): boolean;
    /**
     * Function: beforeEncode
     *
     * Hook for subclassers to pre-process the object before
     * encoding. This returns the input object. The return
     * value of this function is used in <encode> to perform
     * the default encoding into the given node.
     *
     * Parameters:
     *
     * enc - <mxCodec> that controls the encoding process.
     * obj - Object to be encoded.
     * node - XML node to encode the object into.
     */
    beforeEncode(enc: mxCodec, obj: Object, node: Element): Object;
    /**
     * Function: afterEncode
     *
     * Hook for subclassers to post-process the node
     * for the given object after encoding and return the
     * post-processed node. This implementation returns 
     * the input node. The return value of this method
     * is returned to the encoder from <encode>.
     *
     * Parameters:
     *
     * enc - <mxCodec> that controls the encoding process.
     * obj - Object to be encoded.
     * node - XML node that represents the default encoding.
     */
    afterEncode(enc: mxCodec, obj: Object, node: Element): Element;
    /**
     * Function: decode
     *
     * Parses the given node into the object or returns a new object
     * representing the given node.
     *
     * Dec is a reference to the calling decoder. It is used to decode
     * complex objects and resolve references.
     *
     * If a node has an id attribute then the object cache is checked for the
     * object. If the object is not yet in the cache then it is constructed
     * using the constructor of <template> and cached in <mxCodec.objects>.
     *
     * This implementation decodes all attributes and childs of a node
     * according to the following rules:
     *
     * - If the variable name is in <exclude> or if the attribute name is "id"
     * or "as" then it is ignored.
     * - If the variable name is in <idrefs> then <mxCodec.getObject> is used
     * to replace the reference with an object.
     * - The variable name is mapped using a reverse <mapping>.
     * - If the value has a child node, then the codec is used to create a
     * child object with the variable name taken from the "as" attribute.
     * - If the object is an array and the variable name is empty then the
     * value or child object is appended to the array.
     * - If an add child has no value or the object is not an array then
     * the child text content is evaluated using <mxUtils.eval>.
     *
     * For add nodes where the object is not an array and the variable name
     * is defined, the default mechanism is used, allowing to override/add
     * methods as follows:
     *
     * (code)
     * <Object>
     *   <add as="hello"><![CDATA[
     *     function(arg1) {
     *       mxUtils.alert('Hello '+arg1);
     *     }
     *   ]]></add>
     * </Object>
     * (end) 
     *
     * If no object exists for an ID in <idrefs> a warning is issued
     * using <mxLog.warn>.
     *
     * Returns the resulting object that represents the given XML node
     * or the object given to the method as the into parameter.
     *
     * Parameters:
     *
     * dec - <mxCodec> that controls the decoding process.
     * node - XML node to be decoded.
     * into - Optional objec to encode the node into.
     */
    decode(dec: mxCodec, node: Element, into?: Object): Object;
    /**
     * Function: decodeNode
     * 
     * Calls <decodeAttributes> and <decodeChildren> for the given node.
     * 
     * Parameters:
     *
     * dec - <mxCodec> that controls the decoding process.
     * node - XML node to be decoded.
     * obj - Objec to encode the node into.
     */
    decodeNode(dec: mxCodec, node: Element, obj: Object);
    /**
     * Function: decodeAttributes
     * 
     * Decodes all attributes of the given node using <decodeAttribute>.
     * 
     * Parameters:
     *
     * dec - <mxCodec> that controls the decoding process.
     * node - XML node to be decoded.
     * obj - Objec to encode the node into.
     */
    decodeAttributes(dec: mxCodec, node: Element, obj: Object);
    /**
     * Function: decodeAttribute
     * 
     * Reads the given attribute into the specified object.
     * 
     * Parameters:
     *
     * dec - <mxCodec> that controls the decoding process.
     * attr - XML attribute to be decoded.
     * obj - Objec to encode the attribute into.
     */
    decodeAttribute(dec: mxCodec, attr: Element, obj: Object);
    /**
     * Function: decodeChildren
     * 
     * Decodec all children of the given node using <decodeChild>.
     * 
     * Parameters:
     *
     * dec - <mxCodec> that controls the decoding process.
     * node - XML node to be decoded.
     * obj - Objec to encode the node into.
     */
    decodeChildren(dec: mxCodec, node: Element, obj: Object);
    /**
     * Function: decodeChild
     * 
     * Reads the specified child into the given object.
     * 
     * Parameters:
     *
     * dec - <mxCodec> that controls the decoding process.
     * child - XML child element to be decoded.
     * obj - Objec to encode the node into.
     */
    decodeChild(dec: mxCodec, child: Element, obj: Object);
    /**
     * Function: getFieldTemplate
     * 
     * Returns the template instance for the given field. This returns the
     * value of the field, null if the value is an array or an empty collection
     * if the value is a collection. The value is then used to populate the
     * field for a new instance. For strongly typed languages it may be
     * required to override this to return the correct collection instance
     * based on the encoded child.
     */
    getFieldTemplate(obj: Object, fieldname: string, child: any): Object;
    /**
     * Function: addObjectValue
     * 
     * Sets the decoded child node as a value of the given object. If the
     * object is a map, then the value is added with the given fieldname as a
     * key. If the fieldname is not empty, then setFieldValue is called or
     * else, if the object is a collection, the value is added to the
     * collection. For strongly typed languages it may be required to
     * override this with the correct code to add an entry to an object.
     */
    addObjectValue(obj: Object, fieldname: string, value: any, template: Object);
    /**
     * Function: processInclude
     *
     * Returns true if the given node is an include directive and
     * executes the include by decoding the XML document. Returns
     * false if the given node is not an include directive.
     *
     * Parameters:
     *
     * dec - <mxCodec> that controls the encoding/decoding process.
     * node - XML node to be checked.
     * into - Optional object to pass-thru to the codec.
     */
    processInclude(dec: mxCodec, node: Element, into?: Object): boolean;
    /**
     * Function: beforeDecode
     *
     * Hook for subclassers to pre-process the node for
     * the specified object and return the node to be
     * used for further processing by <decode>.
     * The object is created based on the template in the 
     * calling method and is never null. This implementation
     * returns the input node. The return value of this
     * function is used in <decode> to perform
     * the default decoding into the given object.
     *
     * Parameters:
     *
     * dec - <mxCodec> that controls the decoding process.
     * node - XML node to be decoded.
     * obj - Object to encode the node into.
     */
    beforeDecode(dec: mxCodec, node: Element, obj: Object): Element;
    /**
     * Function: afterDecode
     *
     * Hook for subclassers to post-process the object after
     * decoding. This implementation returns the given object
     * without any changes. The return value of this method
     * is returned to the decoder from <decode>.
     *
     * Parameters:
     *
     * enc - <mxCodec> that controls the encoding process.
     * node - XML node to be decoded.
     * obj - Object that represents the default decoding.
     */
    afterDecode(dec: mxCodec, node: Element, obj: Object): Object;

}

declare var mxObjectCodec: {
    new (template: Object, exclude?: string[], idrefs?: string[], mapping?: any[]): mxObjectCodec;
    prototype: mxObjectCodec;
}

//}