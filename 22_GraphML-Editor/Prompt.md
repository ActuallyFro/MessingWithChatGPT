= GraphML SPA Editor
Provide a SPA, HTML/JavaScript/CSS, that allows the dynamic editing of attributes, edges, and nodes for a graphml, XML output.

== Editing Requirements
* User interfacing is accomplished through HTML-form inputs with dynamic Javascript elements.
* Objects for attributes, Edges, and Nodes can be added, edited, and removed
* All entries are dynamically linked/accessible through an HTML form
** For instance: an "edit object" section allows selection of existing objects
** Edges can re-use created nodes, which are added to the tables/links when created
** Nodes have indefinately expandable key/value pairs (e.g., a + button adds new form elements for key/value pairs)
* Inputs need to ensure to capture information of XML compliance.

== Output requirements
* The User-inputed forms will be used to generate an XML text output
** The bottom of he page will render a live preview
** An export button shall provide a raw XML, GraphML compilant file.

== Input requirements
* The exported XML file can be re-imported into the editor
** The editor will parse the XML and re-render the forms with the data
** The editor will re-render the live preview

== Compliance issues for XML
* Graph
** Graphs in GraphML are mixed, in other words, they can contain directed and undirected edges at the same time. If no direction is specified when an edge is declared, the default direction is applied to the edge. The default direction is declared as the XML Attribute edgedefault of the graph element.
** The two possible value for this XML Attribute are directed and undirected.
** Note that the default direction must be specified.
** Optionally an identifier for the graph can be specified with the XML Attribute id.
** The identifier is used, when it is necessary to reference the graph.
* Nodes
** Nodes in the graph are declared by the node element.
** Each node has an identifier, which must be unique within the entire document, i.e., in a document there must be no two nodes with the same identifier.
** The identifier of a node is defined by the XML-Attribute id.
* Edges
** Edges in the graph are declared by the edge element. Each edge must define its two endpoints with the XML-Attributes source and target.
** The value of the source, resp. target, must be the identifier of a node in the same document.
** Edges with only one endpoint, also called loops, selfloops, or reflexive edges, are defined by having the same value for source and target.
** The optional XML-Attribute directed declares if the edge is directed or undirected.
** The value true declares a directed edge, the value false an undirected edge. 
** If the direction is not explicitely defined, the default direction is applied to this edge as defined in the enclosing graph.
** Optionally an identifier for the edge can be specified with the XML Attribute id. 
** When it is necessary to reference the edge, the id XML-Attribute is used.
* Attributes
** A GraphML-Attribute is defined by a key element which specifies the identifier, name, type and domain of the attribute.
** The identifier is specified by the XML-Attribute id and is used to refer to the GraphML-Attribute inside the document.
** The name of the GraphML-Attribute is defined by the XML-Attribute attr.name and must be unique among all GraphML-Attributes declared in the document.
** The purpose of the name is that applications can identify the meaning of the attribute.
** Note that the name of the GraphML-Attribute is not used inside the document, the identifier is used for this purpose.
** The type of the GraphML-Attribute can be either boolean, int, long, float, double, or string. 
** These types are defined like the corresponding types in the Java(TM)-Programming language.
** The domain of the GraphML-Attribute specifies for which graph elements the GraphML-Attribute is declared.
** Possible values include graph, node, edge, and all.


== XML Template
```xml
<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns 
     http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">

  ...

</graphml>
```

== Example GraphML XML with Attributes
```xml
<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"  
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns 
        http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <key id="d0" for="node" attr.name="color" attr.type="string">
    <default>yellow</default>
  </key>
  <key id="d1" for="edge" attr.name="weight" attr.type="double"/>
  <graph id="G" edgedefault="undirected">
    <node id="n0">
      <data key="d0">green</data>
    </node>
    <node id="n1"/>
    <node id="n2">
      <data key="d0">blue</data>
    </node>
    <node id="n3">
      <data key="d0">red</data>
    </node>
    <node id="n4"/>
    <node id="n5">
      <data key="d0">turquoise</data>
    </node>
    <edge id="e0" source="n0" target="n2">
      <data key="d1">1.0</data>
    </edge>
    <edge id="e1" source="n0" target="n1">
      <data key="d1">1.0</data>
    </edge>
    <edge id="e2" source="n1" target="n3">
      <data key="d1">2.0</data>
    </edge>
    <edge id="e3" source="n3" target="n2"/>
    <edge id="e4" source="n2" target="n4"/>
    <edge id="e5" source="n3" target="n5"/>
    <edge id="e6" source="n5" target="n4">
      <data key="d1">1.1</data>
    </edge>
  </graph>
</graphml>
```
