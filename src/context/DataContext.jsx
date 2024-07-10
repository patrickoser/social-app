import { createContext, useEffect, useState } from "react";
import api from '../api/postsAxios'
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'