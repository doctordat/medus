import assert from 'node:assert/strict';
import { groupTextItemsIntoLines } from '../admin/pdf-line-grouping.js';

const item=(str,x,y)=>({str,transform:[1,0,0,1,x,y]});
assert.deepEqual(groupTextItemsIntoLines([
  item('Body',40,100), item('1. Overview',0,100.5), item('',0,99), item('Next',0,97)
]), ['1. Overview Body','Next']);
assert.deepEqual(groupTextItemsIntoLines([
  item('right',600,100), item('left',0,100), item('jitter',0,97.1)
]), ['left right','jitter']);
assert.deepEqual(groupTextItemsIntoLines([
  item('Overview',0,100), item('1.',45,100), item('Body',65,100)
]), ['Overview 1. Body']);
console.log('PDF line grouping adversarial tests passed');
