import style from "../styles/App.module.css";

import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Contact from "../components/Contact";

import url from "../assets/bram-naus-n8Qb1ZAkK88-unsplash.jpg";

const posts = [
	{
		id: "1",
		url,
		title: "Overview of the DevOps Interview Process: From Application to Selection-Part Terraform",
		content: `AI language models, such as ChatGPT and Claude, empower anyone to create software. These models can intelligently understand problems, create solutions, and explain the solutions. But natural language isn’t always the best way to communicate with AI. If you need to keep track of complex data and define how you interact with that data in specific ways, SudoLang can help.

If you think this is only going to help with AI code, think again. You can author any program in SudoLang and then transpile it to other languages, like JavaScript, Python, Rust, or C — so you can take advantage of these features no matter what kind of software you’re building.

What is SudoLang?
SudoLang is a programming language designed to collaborate with AI language models including ChatGPT, Bing Chat, Anthropic Claude, and Google Bard. It is designed to be easy to learn and use. It is also very expressive and powerful.

All advanced language models understand it without any special prompting. You do not need to paste the SudoLang specification before using SudoLang with your favorite AI.

Please read the SudoLang documentation for more information about the language.

Interfaces in SudoLang
Interface-oriented programming lets you structure your program and easily declare what you want the AI to keep track of and how you want to interact with it.

Interfaces are a powerful tool to encapsulate related state, constraints, commands, and functions. They organize the code in a clear, understandable, and reusable way.

The key features of interfaces in SudoLang include:

State: This represents the data associated with the interface.
Constraints: These are rules or requirements defined in natural language that the AI maintains automatically.
/Commands and methods: These are operations that can be performed on or by the interface.`,
		publish: true,
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "2",
		url,
		title: "The Future of Programming: AI and Interface-Oriented Languages",
		content: `Problems With Class Inheritance
Class inheritance was a failed experiment at code-reuse that frequently ended in forced code duplication caused by the following common, well-known problems:

The Fragile Base Class Problem
The Gorilla/Banana Problem
The Duplication by Necessity Problem
For this reason, SudoLang does not use class inheritance, and the SudoLang linter will report errors and suggest fixes if you try to use it. To understand why, let’s dive a little deeper into those problems:

The Fragile Base Class Problem: This problem arises in traditional OOP languages when a change to a base class (or superclass) unintentionally and negatively impacts descendant classes (or subclasses). If a method is modified in the base class, it can cause a chain of failures in any class that inherits from it.

SudoLang avoids this issue by favoring composition over inheritance. In SudoLang, you don’t have subclasses inheriting from a base class; instead, you define independent, self-contained interfaces. Each interface can be thought of as a module that encapsulates its own state and behavior. You can then create larger interfaces by composing these smaller ones. This way, changes to one interface won’t inadvertently break another.

The Gorilla/Banana Problem: This is another issue associated with traditional inheritance in OOP. It’s a term coined by Joe Armstrong, the designer of Erlang, referring to the situation where you wanted a banana but what you got was a gorilla holding the banana, and the entire jungle. In other words, when a class inherits from a base class, it’s forced to inherit all its methods and data, even those it doesn’t need, which can lead to unnecessary complexity.

SudoLang addresses this issue again through its interface composition design. Since each interface is an independent module, when you compose interfaces, you only include the granular functionality that you need. This gives you a high degree of control over the structure and behavior of your program, allowing you to avoid unnecessary complexity and keep your codebase lean and manageable.

Duplication by Necessity: In traditional OOP languages, sometimes you are forced to duplicate code in order to avoid the problems mentioned above. For instance, to avoid the Fragile Base Class problem, you might decide not to use inheritance, resulting in code duplication. Or if you want the banana, but the gorilla really won’t do, you’ll copy and paste the banana.

SudoLang’s interface composition design addresses this issue, too. Since interfaces can be composed, you can define a common functionality once in an interface, and then compose that interface wherever you need that functionality. This allows you to keep your code DRY (Don’t Repeat Yourself) without the need for inheritance.`,
		publish: true,
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "3",
		url,
		title: "This is title C",
		content: "This is content C",
		publish: true,
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "4",
		url,
		title: "This is title C",
		content: "This is content C",
		publish: true,
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "5",
		url,
		title: "This is title C",
		content: "This is content C",
		publish: true,
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "6",
		url,
		title: "This is title C",
		content: "This is content C",
		publish: true,
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "7",
		url,
		title: "This is title C",
		content: "This is content C",
		publish: true,
		createdAt: new Date("2024/5/1"),
	},
	{
		id: "8",
		url,
		title: "This is title C",
		content: "This is content C",
		publish: true,
		createdAt: new Date("2024/5/1"),
	},
];
const user = {
	name: "Name",
	isAdmin: true,
	email: "Admin@gmail.com",
};

const App = () => {
	const darkTheme = false;
	return (
		<div className={`${darkTheme ? style.dark : ""} ${style.app}`}>
			<Header user={user} />
			<div className={style.container}>
				<main>
					<Outlet context={{ posts, user }} />
				</main>
				<Contact />
				<Footer />
			</div>
		</div>
	);
};

export default App;
