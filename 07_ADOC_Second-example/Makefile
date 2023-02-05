all: plantuml.png adoc-example-1.pdf adoc-example-2.pdf

plantuml.png: images/plantuml.text
	java -jar ~/.local/bin/plantuml/plantuml.jar images/plantuml.text

plantuml2.png: images/plantuml2.text
	java -jar ~/.local/bin/plantuml/plantuml.jar images/plantuml2.text

adoc-example-1.pdf: plantuml.png plantuml2.png 
	asciidoctor-pdf -a pdf-style=themes/center-figs-and-labels.yml example.adoc

adoc-example-2.pdf:
	asciidoctor-pdf example2.adoc

clean-plantuml:
	rm -f images/plantuml.png
	rm -f images/plantuml2.png
