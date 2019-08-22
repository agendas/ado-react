import {compareDeadlines, compareTasks, dateFor, daysSince1970} from "../compare";
import {Deadline, DeadlineType, Task} from "../models";

describe("dateFor()", () => {
   it("returns date at start of day for date-only deadlines", () => {
      expect(dateFor({type: DeadlineType.Date, date: 0})).toEqual(new Date(1970, 0,  1, 0, 0, 0, 0));
   });

   it("returns correct date for datetime deadlines", () => {
      const timestamp = 12345678;
      expect(dateFor({type: DeadlineType.Datetime, timestamp}).getTime()).toEqual(timestamp * 1000);
   });
});

describe("daysSince1970()", () => {
   it("returns days since 1970 for date-only deadlines", () => {
      expect(daysSince1970({type: DeadlineType.Date, date: 0})).toEqual(0);
   });

   it("returns days since 1970 for datetime deadlines", () => {
      const date = new Date();
      console.log(daysSince1970({type: DeadlineType.Datetime, timestamp: Math.floor(date.getTime() / 1000)}));
      expect(daysSince1970({type: DeadlineType.Datetime, timestamp: Math.floor(date.getTime() / 1000)}))
          .toEqual(Math.floor((date.getTime() / 60000 + date.getTimezoneOffset()) / (24 * 60)));
   });

   it("returns zero for the epoch", () => {
      expect(daysSince1970({type: DeadlineType.Datetime, timestamp: Math.floor(new Date(1970, 0,  1, 0, 0, 0, 0).getTime() / 1000)}))
          .toEqual(0);
   });

   it("returns zero for the epoch plus one second", () => {
      expect(daysSince1970({type: DeadlineType.Datetime, timestamp: Math.floor(new Date(1970, 0,  1, 0, 0, 0, 0).getTime() / 1000) + 1}))
          .toEqual(0);
   });
});

describe("compareDeadlines()", () => {
   it("compares equal date-only deadlines", () => {
      expect(compareDeadlines({type: DeadlineType.Date, date: 0}, {type: DeadlineType.Date, date: 0})).toEqual(0);
   });

   it("compares equal datetime deadlines", () => {
      expect(compareDeadlines({type: DeadlineType.Datetime, timestamp: 0}, {type: DeadlineType.Datetime, timestamp: 0}))
          .toEqual(0);
   });

   it("compares deadlines", () => {
      const order: Deadline[] = [
         {type: DeadlineType.Datetime, timestamp: 0},
         {type: DeadlineType.Date, date: 1},
         {type: DeadlineType.Datetime, timestamp: 172000},
         {type: DeadlineType.Datetime, timestamp: 172001},
         {type: DeadlineType.Date, date: 3},
         {type: DeadlineType.Date, date: 4}
      ];
      for (let i = 0; i < order.length; i++) {
         expect(compareDeadlines(order[i], order[i])).toEqual(0);
         for (let j = i + 1; j < order.length; j++) {
            console.log(`Comparing date ${i + 1} with ${j + 1}`);
            expect(compareDeadlines(order[i], order[j])).toEqual(-1);
            expect(compareDeadlines(order[j], order[i])).toEqual(1);
         }
      }
   });
});

describe("compareTasks()", () => {
   it("compares tasks without deadlines after tasks with deadlines", () => {
      const order: Task[] = [
         {id: "123", deadline: {type: DeadlineType.Date, date: 0}, created_at: 0},
         {id: "1", created_at: 0}
      ];
      for (let i = 0; i < order.length; i++) {
         for (let j = i + 1; j < order.length; j++) {
            console.log(`Comparing task ${i + 1} with ${j + 1}`);
            expect(compareTasks(order[i], order[j])).toEqual(-1);
            expect(compareTasks(order[j], order[i])).toEqual(1);
         }
      }
   });

   it("compares tasks based on deadline", () => {
      const order: Task[] = [
         {id: "123", deadline: {type: DeadlineType.Date, date: 0}, created_at: 0},
         {id: "1", deadline: {type: DeadlineType.Date, date: 1}, created_at: 0}
      ];
      for (let i = 0; i < order.length; i++) {
         for (let j = i + 1; j < order.length; j++) {
            console.log(`Comparing task ${i + 1} with ${j + 1}`);
            expect(compareTasks(order[i], order[j])).toEqual(-1);
            expect(compareTasks(order[j], order[i])).toEqual(1);
         }
      }
   });

   it("compares tasks based on priority when deadlines are equal", () => {
      const order: Task[] = [
         {id: "11", deadline: {type: DeadlineType.Date, date: 0}, priority: -1, created_at: 0},
         {id: "123", deadline: {type: DeadlineType.Date, date: 0}, created_at: 0},
         {id: "1", deadline: {type: DeadlineType.Date, date: 0}, priority: 3, created_at: 0}
      ];
      for (let i = 0; i < order.length; i++) {
         for (let j = i + 1; j < order.length; j++) {
            console.log(`Comparing task ${i + 1} with ${j + 1}`);
            expect(compareTasks(order[i], order[j])).toEqual(-1);
            expect(compareTasks(order[j], order[i])).toEqual(1);
         }
      }
   });

   it("compares created_at last", () => {
      const order: Task[] = [
         {id: "123", deadline: {type: DeadlineType.Date, date: 0}, created_at: 0},
         {id: "1", deadline: {type: DeadlineType.Date, date: 0}, created_at: 1}
      ];
      for (let i = 0; i < order.length; i++) {
         for (let j = i + 1; j < order.length; j++) {
            console.log(`Comparing task ${i + 1} with ${j + 1}`);
            expect(compareTasks(order[i], order[j])).toEqual(-1);
            expect(compareTasks(order[j], order[i])).toEqual(1);
         }
      }
   });
});

export default undefined;