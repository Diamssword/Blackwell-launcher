import App from './App.svelte';

const app = new App({
	target: document.body,
	props:{
		name:"Owl Launcher",
		VARS:JSON.parse('glob.placeholder') //injecté en dev par rollup
	}
});

export default app;