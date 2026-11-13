import type {APIRoute} from 'astro';
import {buildSearchIndexResponse} from '../../utils/search-index';
export const GET:APIRoute=()=>buildSearchIndexResponse('fr');
