// <!-- Update your existing CodeMirror initialization script -->

const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  lineNumbers: true,
  theme: 'dracula',
  autoCloseTags: true,
  lineWrapping: true,
  autoCloseBrackets: true,
  mode: 'javascript', // Add this line for JavaScript syntax highlighting
  hint: CodeMirror.hint.javascript, // Enable autocomplete for JavaScript
  extraKeys: { 'Ctrl-Space': 'autocomplete' }, // Optional: Enable Ctrl-Space for autocomplete
});

const outputElement = document.getElementById('output');
const consoleOutput = [];
const originalConsoleLog = console.log;

// Enable autocomplete
CodeMirror.registerHelper('hint', 'javascript', CodeMirror.hint.javascript);

editor.on('change', () => {
  try {
    // Clear previous output and console output
    outputElement.innerHTML = '';
    consoleOutput.length = 0; // Clear the console output array

    const code = editor.getValue();

    // Override console.log to capture output
    console.log = function (...args) {
      consoleOutput.push(args);
      originalConsoleLog.apply(console, args);
    };

    // Execute the code using eval
    eval(code);

    // Display console.log output
    consoleOutput.forEach(entry => {
      entry.forEach(item => {
        if (typeof item === 'object') {
          outputElement.innerHTML += JSON.stringify(item) + ' ';
        } else {
          outputElement.innerHTML += item + ' ';
        }
      });
      outputElement.innerHTML += '<br>';
    });

    // Restore original console.log
    console.log = originalConsoleLog;
  } catch (error) {
    // Display error message in real-time
    outputElement.innerHTML = error;
  }
});
