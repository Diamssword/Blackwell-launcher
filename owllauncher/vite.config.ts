import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { createHtmlPlugin } from 'vite-plugin-html'
import {patchDevEnv} from "./devutils"
import * as dotenv from 'dotenv'
dotenv.config();
var globals={};
if(process.env.DEV) 
{
	patchDevEnv(globals);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          VARS: JSON.stringify(globals),
        }
      }
    }),]
})
