/**
 * dotenv enables us to use environment variables to store sensitive and repeatedly used variables in .env file 
 */
import 'dotenv/config';

import * as React from "react";
import { render } from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
render(<App />, rootElement);
