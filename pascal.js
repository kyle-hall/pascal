
const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
const EOF = 'EOF';
const isDigitRegex = new RegExp(/\d/);

function isDigit(str) {
	return isDigitRegex.test(str);
}

var Token =  function(type, value) {
	return {
		type,
		value
	};
};

var Interpreter = {
	init: function(text) {
		this.text = text;
		this.pos = 0;
		this.currentToken = null;
	},

	error: function() {
		throw {
			name: "Interpreter Error",
			message: "Error processing input"
		};
	},

	getNextToken: function() {
		let token;
		let text = this.text;

		if (this.pos >= text.length) {
			return Token(EOF, null);
		}

		let currentChar = text[this.pos];

		if (isDigit(currentChar)) {
			token = Token(INTEGER, currentChar);
			this.pos += 1;
			return token;
		} else if (currentChar === '+') {
			token = Token(PLUS, currentChar);
			this.pos += 1;
			return token;
		} else {
			this.error();
		}
	},

	eat: function(tokenType) {
		if (this.currentToken.type === tokenType) {
			this.currentToken = this.getNextToken();
		} else {
			this.error();
		}
	},

	eval: function() {
		this.currentToken = this.getNextToken();

		let left = "",
				right = "";

		while (this.currentToken.type !== PLUS) {
			left += this.currentToken.value;
			this.eat(INTEGER);
		}

		let op = this.currentToken;
		this.eat(PLUS);

		while(this.currentToken.type !== EOF) {
			right += this.currentToken.value;
			this.eat(INTEGER);
		}

		let result = parseInt(left) + parseInt(right);
		return result;
	}

}

function main() {
	function prompt(question, callback) {
		process.stdin.setEncoding('utf8');
		process.stdout.setEncoding('utf8');

		process.stdin.resume();
		process.stdout.write(question);
		process.stdin.once('data', function (data) {
			callback(data.toString().substring(0, data.toString().length - 1));
		});
	}

	function calc(str) {
		interpreter.init(str);
		let result = interpreter.eval();
		process.stdout.write(result + "\n");
		prompt("> ", calc);
	}

	const interpreter = Object.assign(Interpreter);

	prompt("> ", calc);
}

main();