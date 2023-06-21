// Set up variables for the current node and edge
let currentNode = null;
let nodeLabels = new Map();


// Function to show the current node and edge
function createDownloadLink(graphmlFile, SVGFile, PDFFile) {
	// Create the h2 element
	const heading = document.createElement('h2');
	heading.innerHTML = 'Download sources';

	// Create the link element
	const link = document.createElement('a');
	link.innerHTML = 'Graphml';
	link.href = graphmlFile.replace(/^http:/, '');
	link.download = graphmlFile.split('/').pop(); // Set the filename as the last part of the URL
	link.style.display = 'block';

	const SVGlink = document.createElement('a');
	SVGlink.innerHTML = 'SVG';
	SVGlink.href = SVGFile.replace(/^http:/, '');
	SVGlink.download = SVGFile.split('/').pop(); // Set the filename as the last part of the URL
	SVGlink.style.display = 'block';

	const filecontainer = document.getElementById('file-container');
	filecontainer.appendChild(heading);
	filecontainer.appendChild(link);
	filecontainer.appendChild(SVGlink);
}

function showGraph(svgFile) {
	// Create the h2 element
	const heading = document.createElement('h2');
	heading.innerHTML = 'The flowchart';

	// Create the container for the SVG image
	const svgImage = document.createElement('img');
	svgImage.src = svgFile.replace(/^http:/, '');
	svgImage.classList.add("style-svg");
	svgImage.style.maxWidth = '75%'; // Set maximum width of the SVG to 75% of the screen width

	// Open the SVG file in a separate window when clicked
	svgImage.addEventListener('click', () => {
		window.open(svgFile.replace(/^http:/, ''), '_blank');
	});

	// Add the CSS rule to change the mouse pointer when the user hovers over the SVG image
	svgImage.style.cursor = 'pointer';
	// Add the download and SVG containers to the file container
	const graphContainer = document.getElementById('graph-container');
	graphContainer.appendChild(heading);
	graphContainer.appendChild(svgImage);
}


// Adds previous answers to previousQuestions-container
function addPreviousQuestion(question, answer) {
	const previousQuestionsDiv = document.getElementById("previousQuestions-container");
	if (previousQuestionsDiv.innerHTML == "") {
		const heading = document.createElement("h2");
		heading.innerText = "Previous choices";
		previousQuestionsDiv.appendChild(heading);
	}

	const questionParagraph = document.createElement("p");
	questionParagraph.innerText = `Question: ${question}`;

	const answerParagraph = document.createElement("p");
	answerParagraph.innerText = `Chosen answer: ${answer}`;
	const hr = document.createElement("hr");
	previousQuestionsDiv.appendChild(questionParagraph);
	previousQuestionsDiv.appendChild(answerParagraph);
	previousQuestionsDiv.appendChild(hr);
}

// Function to show the current node and edge
function showQuestion(questions) {
	graph = questions;
	// Clear the question container
	const questionContainer = document.getElementById('question-container');
	questionContainer.innerHTML = '';

	if (graph.get(currentNode).length > 0) {

		// Create a heading for the current node
		const nodeHeading = document.createElement('h2');
		nodeHeading.innerHTML = "Question";
		nodeHeading.setAttribute('id', 'question'); // add anchor 
		questionContainer.appendChild(nodeHeading);

		// Create a heading for the current node
		const question = nodeLabels.get(currentNode)
		const nodeQuestion = document.createElement('p');
		nodeQuestion.innerHTML = question;
		questionContainer.appendChild(nodeQuestion);


		// Create a list of buttons for each edge connected to the current node
		for (let i = 0; i < graph.get(currentNode).length; i++) {
			const edge = graph.get(currentNode)[i];

			const edgeContainer = document.createElement('div');
			questionContainer.appendChild(edgeContainer);

			const edgeItem = document.createElement('div');
			edgeItem.classList.add('wp-block-button');
			edgeContainer.appendChild(edgeItem);

			const edgeButton = document.createElement('a');
			let buttonLabel = edge[1]
			console.log(edge)
			if (buttonLabel == "") {
				buttonLabel = "Continue";
			}
			edgeButton.textContent = buttonLabel;
			edgeButton.href = '#';
			edgeButton.onclick = function() {
				// Update the current edge and show the next question
				currentNode = edge[0];
				addPreviousQuestion(question, edge[1]);
				showQuestion(graph);
				// Delay setting the hash until after the page has finished scrolling
				setTimeout(function() {
					// Set the URL fragment identifier to #question
					window.location.hash = "question";

					// Scroll to the anchor
					const questionAnchor = document.getElementById('question');
					const questionAnchorTop = questionAnchor.getBoundingClientRect().top + window.pageYOffset;
					window.scrollTo(0, questionAnchorTop - window.innerHeight * 0.25);
				}, 0);
			};
			edgeItem.appendChild(edgeButton);
		}
	} else {
		// A result hase been found
		// Create a heading for the current node
		const nodeHeading = document.createElement('h2');
		nodeHeading.innerHTML = "Result";
		nodeHeading.setAttribute('id', 'question'); // add anchor
		questionContainer.appendChild(nodeHeading);

		// Create a heading for the current node
		const nodeResult = document.createElement('p');
		nodeResult.innerHTML = nodeLabels.get(currentNode);
		questionContainer.appendChild(nodeResult);

	}
	
	const hr = document.createElement("hr");
	questionContainer.appendChild(hr);
	
	// Create a div to hold the print buttons
	const printButtonContainer = document.createElement('div');
	printButtonContainer.classList.add('print-button-container');

	// Create a button to print the questions
	const printButton = document.createElement('a');
	printButton.classList.add('wp-block-button');
	printButton.classList.add('print-button');
	printButton.textContent = 'Print Result';
	printButton.style.display = 'block';

	// Add the onclick function to print the questions
	printButton.onclick = printFriendlyLayout;

	// Add the print button to the container
	printButtonContainer.appendChild(printButton);

	// Add the container to the question container
	questionContainer.appendChild(printButtonContainer);
	
	// Create a div to wrap the reset button
	const resetButtonWrapper = document.createElement('div');

	// Create a button to reset the flowchart
	const resetButton = document.createElement('a');
	resetButton.classList.add('wp-block-button');
	resetButton.classList.add('print-button');
	resetButton.textContent = 'Reset flowchart';
	resetButton.style.display = 'block';

	// Add the onclick function to reset the flowchart
	resetButton.onclick = function() {
		location.reload();
	};

	// Append the button to the wrapper div
	resetButtonWrapper.appendChild(resetButton);

	// Append the wrapper div to the question container
	questionContainer.appendChild(resetButtonWrapper);
}

function printFriendlyLayout() {
    const prevContainer = document.getElementById('previousQuestions-container');
    const questionContainer = document.getElementById('question-container');
    const pageTitle = document.querySelector('title').textContent;

    // Modify h2 element in previous questions container
    const prevHeader = prevContainer.querySelector('h2');
    if (prevHeader) {
        prevHeader.textContent = 'Choices';
    }

    // Copy h1 from current page and set as title
    const resultTitle = document.createElement('title');
    resultTitle.textContent = pageTitle;
    const resultHeader = document.querySelector('#wp--skip-link--target > div:nth-child(1) > h1').textContent;

    // Remove all anchors with class 'print-button'
    const printButtons = questionContainer.querySelectorAll('a.print-button');
    printButtons.forEach(button => button.remove());

    const printContainer = document.createElement('div');
    printContainer.innerHTML = `
        <html>
        <head>
            ${resultTitle.outerHTML}
            <style>
                body {
                    font-size: 14px;
                }
                h1 {
                    margin-top: 1.5em;
                }
                h2 {
                    margin-top: 1.5em;
                }
                #previousQuestion-container, #question-container {
                    margin-top: 1.5em;
                }
                .question {
                    margin-left: 2em;
                }
            </style>
        </head>
        <body>
            <h1>${resultHeader}</h1>
			<p>source: ${window.location.href}</p>
			<p>Date: ${new Date().toLocaleDateString('en-US')}</p>
            <div class="question">${prevContainer.innerHTML.replace(/\n/g, '\n\t\t\t')}</div>
            <div class="question">${questionContainer.innerHTML.replace(/\n/g, '\n\t\t\t')}</div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', 'Print Friendly Layout', 'height=600,width=800');
    printWindow.document.write(printContainer.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}



// Function to find the root of a directed graph
function findRoot(graph) {
	const nodes = new Set(graph.keys());
	const targets = new Set();

	for (const edges of graph.values()) {
		for (const [target, label] of edges) {
			targets.add(target);
		}
	}

	for (const node of nodes) {
		if (!targets.has(node)) {
			return node;
		}
	}

	// No root found
	return null;
}

function getAttributeFromNode (node, attributeName) {
	try {
		return node.getAttribute(attributeName);
	} catch (error) {
		console.log(`Error get ${attributeName} from ${node}`);
		return None;
	}
}

// Function to initialize the plugin
function myGraphInit(graphmlFile) {
	// Read the GraphML file
	fetch(graphmlFile.replace(/^http:/, ''))
		.then(response => response.text())
		.then(xml => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(xml, 'application/xml');
			const nodes = doc.getElementsByTagName('node');
			console.log(doc)
			const edges = doc.getElementsByTagName('edge');
			const graph = new Map();

			for (let i = 0; i < nodes.length; i++) {
				const nodeId = getAttributeFromNode(nodes[i], 'id');
				graph.set(nodeId, []);

				try {
					const label = nodes[i].getElementsByTagName('y:NodeLabel')[0].textContent; // Get the node label
					nodeLabels.set(nodeId, label.replace(/(\r\n|\n|\r)/gm, " ").trim().replace(/ \(\d+\)$/, '')); // Store the node label in the nodeLabels object
				} catch (error) {
					console.log(`Error loading node label for node ${nodeId}: ${error}`);
				}
			}

			for (let i = 0; i < edges.length; i++) {
				const source = getAttributeFromNode(edges[i], 'source');
				const target = getAttributeFromNode(edges[i], 'target');

				try {
					const label = edges[i].getElementsByTagName('y:EdgeLabel')[0].textContent;
					graph.get(source).push([target, label.replace(/(\r\n|\n|\r)/gm, " ").trim().replace(/ \(\d+\)$/, '')]);
				} catch (error) {
					console.log(`Error loading edge label from ${source} to ${target}: ${error}`);
					graph.get(source).push([target, "Continue"]);
				}
			}

			const foundRoot = findRoot(graph)
			if (foundRoot != null) {
				currentNode = foundRoot;
			} else {
				currentNode = getAttributeFromNode(nodes[0], 'id');
			}
			createDownloadLink(graphmlFile, graphmlFile.replace(/\.graphml/, '.svg'))
			showGraph(graphmlFile.replace(/\.graphml/, '.svg'));
			showQuestion(graph);
		})
		.catch(error => console.log('Error loading GraphML file: ' + error));
}