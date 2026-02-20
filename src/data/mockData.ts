import type { Question, Student, Submission, Contest, ActiveStudent } from '../types';

export const CONTEST: Contest = {
  id: 'csjmu-2024-01',
  name: 'CSJMU UIET Annual Coding Championship',
  duration: 120 * 60,
  startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  passKey: 'CSJMU@UIET4',
  status: 'active',
};

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
    ],
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0, 1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1, 2]' },
      { input: '[3,3]\n6', expectedOutput: '[0, 1]' },
    ],
    tags: ['Array', 'Hash Table'],
    keywords: ['sum', 'array', 'indices', 'target', 'two', 'nums'],
    timeLimit: 1000,
    memoryLimit: 256,
  },
  {
    id: 'q2',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list. Implement an iterative solution for reversing a linked list efficiently.`,
    constraints: [
      'The number of nodes in the list is in the range [0, 5000].',
      '-5000 ≤ Node.val ≤ 5000',
    ],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
    ],
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5, 4, 3, 2, 1]' },
      { input: '[1,2]', expectedOutput: '[2, 1]' },
    ],
    tags: ['Linked List', 'Recursion'],
    keywords: ['linked', 'list', 'reverse', 'node', 'next', 'head'],
    timeLimit: 1000,
    memoryLimit: 256,
  },
  {
    id: 'q3',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum. This is the classic Kadane's Algorithm problem requiring dynamic programming approach.`,
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
    ],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
    ],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' },
    ],
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    keywords: ['subarray', 'maximum', 'sum', 'kadane', 'dynamic', 'nums'],
    timeLimit: 2000,
    memoryLimit: 256,
  },
  {
    id: 'q4',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, in the correct order.`,
    constraints: [
      '1 ≤ s.length ≤ 10⁴',
      's consists of parentheses only: \'()[]{}\''
    ],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    testCases: [
      { input: '()', expectedOutput: 'true' },
      { input: '()[]{} ', expectedOutput: 'true' },
      { input: '(]', expectedOutput: 'false' },
    ],
    tags: ['String', 'Stack'],
    keywords: ['parentheses', 'brackets', 'stack', 'valid', 'string', 'open', 'close'],
    timeLimit: 1000,
    memoryLimit: 256,
  },
  {
    id: 'q5',
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    description: `The Fibonacci numbers form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1. Given \`n\`, calculate \`F(n)\` efficiently using dynamic programming or memoization.`,
    constraints: [
      '0 ≤ n ≤ 30',
    ],
    examples: [
      { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1' },
      { input: 'n = 3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2' },
      { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3' },
    ],
    testCases: [
      { input: '2', expectedOutput: '1' },
      { input: '10', expectedOutput: '55' },
      { input: '0', expectedOutput: '0' },
    ],
    tags: ['Math', 'Dynamic Programming', 'Recursion'],
    keywords: ['fibonacci', 'fib', 'sequence', 'number', 'sum', 'recursion', 'dp'],
    timeLimit: 1000,
    memoryLimit: 256,
  },
];

export const STUDENTS: Student[] = [
  { id: 's1', name: 'Arjun Sharma', rollNo: 'UIET/CS/2021/001', branch: 'Computer Science', competition: 'CSJMU Annual', email: 'arjun@csjmu.ac.in', password: 'pass123', assignedQuestionId: 'q1', loginTime: new Date(Date.now() - 20*60*1000).toISOString(), ip: '192.168.1.101', device: 'Chrome/Windows', status: 'active' },
  { id: 's2', name: 'Priya Verma', rollNo: 'UIET/CS/2021/002', branch: 'Computer Science', competition: 'CSJMU Annual', email: 'priya@csjmu.ac.in', password: 'pass123', assignedQuestionId: 'q2', loginTime: new Date(Date.now() - 18*60*1000).toISOString(), ip: '192.168.1.102', device: 'Firefox/Linux', status: 'active' },
  { id: 's3', name: 'Rohit Gupta', rollNo: 'UIET/IT/2021/003', branch: 'Information Technology', competition: 'CSJMU Annual', email: 'rohit@csjmu.ac.in', password: 'pass123', assignedQuestionId: 'q3', loginTime: new Date(Date.now() - 22*60*1000).toISOString(), ip: '192.168.1.103', device: 'Chrome/Mac', status: 'active' },
  { id: 's4', name: 'Sneha Patel', rollNo: 'UIET/IT/2021/004', branch: 'Information Technology', competition: 'CSJMU Annual', email: 'sneha@csjmu.ac.in', password: 'pass123', assignedQuestionId: 'q4', loginTime: new Date(Date.now() - 19*60*1000).toISOString(), ip: '192.168.1.104', device: 'Safari/iPhone', status: 'submitted' },
  { id: 's5', name: 'Vikram Singh', rollNo: 'UIET/CS/2022/005', branch: 'Computer Science', competition: 'CSJMU Annual', email: 'vikram@csjmu.ac.in', password: 'pass123', assignedQuestionId: 'q5', loginTime: new Date(Date.now() - 25*60*1000).toISOString(), ip: '192.168.1.105', device: 'Edge/Windows', status: 'idle' },
  { id: 's6', name: 'Kavya Reddy', rollNo: 'UIET/CS/2022/006', branch: 'Computer Science', competition: 'CSJMU Annual', email: 'kavya@csjmu.ac.in', password: 'pass123', assignedQuestionId: 'q1', loginTime: new Date(Date.now() - 10*60*1000).toISOString(), ip: '192.168.1.106', device: 'Chrome/Windows', status: 'active' },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub1', studentId: 's4', questionId: 'q4', language: 'python',
    code: `def isValid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n\ns = input()\nprint(str(isValid(s)).lower())`,
    submittedAt: new Date(Date.now() - 5*60*1000).toISOString(),
    status: 'accepted', executionTime: 42, output: 'true\ntrue\nfalse',
    score: 100, plagiarismScore: 3,
    warnings: [{ type: 'tab_switch', timestamp: new Date(Date.now() - 30*60*1000).toISOString(), count: 1 }],
    tabSwitches: 1,
  },
  {
    id: 'sub2', studentId: 's1', questionId: 'q1', language: 'cpp',
    code: `#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n, target;\n    cin >> n;\n    vector<int> nums(n);\n    for(int i=0;i<n;i++) cin>>nums[i];\n    cin>>target;\n    map<int,int> mp;\n    for(int i=0;i<n;i++){\n        if(mp.count(target-nums[i])){\n            cout<<"["<<mp[target-nums[i]]<<", "<<i<<"]";\n            return 0;\n        }\n        mp[nums[i]]=i;\n    }\n}`,
    submittedAt: new Date(Date.now() - 2*60*1000).toISOString(),
    status: 'accepted', executionTime: 18, output: '[0, 1]\n[1, 2]\n[0, 1]',
    score: 95, plagiarismScore: 12,
    warnings: [
      { type: 'tab_switch', timestamp: new Date(Date.now() - 45*60*1000).toISOString(), count: 2 },
      { type: 'blur', timestamp: new Date(Date.now() - 40*60*1000).toISOString(), count: 1 },
    ],
    tabSwitches: 2,
  },
];

export const ACTIVE_STUDENTS: ActiveStudent[] = [
  { student: STUDENTS[0], submission: MOCK_SUBMISSIONS[1], tabSwitches: 2, warnings: 3, lastActivity: new Date(Date.now() - 2*60*1000).toISOString(), language: 'C++', currentStatus: 'Coding', codeLength: 342 },
  { student: STUDENTS[1], tabSwitches: 0, warnings: 0, lastActivity: new Date(Date.now() - 30*1000).toISOString(), language: 'Python', currentStatus: 'Coding', codeLength: 187 },
  { student: STUDENTS[2], tabSwitches: 1, warnings: 1, lastActivity: new Date(Date.now() - 5*60*1000).toISOString(), language: 'Java', currentStatus: 'Idle', codeLength: 523 },
  { student: STUDENTS[3], submission: MOCK_SUBMISSIONS[0], tabSwitches: 1, warnings: 1, lastActivity: new Date(Date.now() - 5*60*1000).toISOString(), language: 'Python', currentStatus: 'Submitted', codeLength: 298 },
  { student: STUDENTS[4], tabSwitches: 4, warnings: 6, lastActivity: new Date(Date.now() - 15*60*1000).toISOString(), language: 'C', currentStatus: 'Idle', codeLength: 112 },
  { student: STUDENTS[5], tabSwitches: 0, warnings: 0, lastActivity: new Date(Date.now() - 45*1000).toISOString(), language: 'C++', currentStatus: 'Coding', codeLength: 89 },
];

export const DEFAULT_CODE: Record<string, string> = {
  c: `#include <stdio.h>

int main() {
    // Write your solution here
    
    return 0;
}`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Write your solution here
    
    return 0;
}`,
  python: `# Write your solution here

def solve():
    pass

solve()`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        
        // Write your solution here
        
    }
}`,
};
