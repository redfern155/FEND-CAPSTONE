import { calcDateDifference } from '../src/client/js/app';

test('Testing Date Difference Calculation: Passing in the current date should result in 0', ()=>{
    expect(calcDateDifference(new Date().getFullYear(),new Date().getMonth() , new Date().getDate())).toBe(0);
})