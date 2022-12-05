import {readFileSync} from "fs"
export function patchDevEnv(window)
{
    const { accessToken, port } =JSON.parse(readFileSync(".tmp/auth_info.json").toString("utf-8"));
    window.NL_PORT = port
	window.NL_TOKEN = accessToken
	window.NL_ARGS = [
		'bin\\neutralino-win_x64.exe',
		'',
		'--load-dir-res',
		'--path=.',
		'--export-auth-info',
		'--neu-dev-extension',
		'--neu-dev-auto-reload',
		'--window-enable-inspector'
	]
}