import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({})

