import { describe, expect, test } from 'bun:test'; import { apexOf,isSubdomainOf } from '../src/shared/urls.ts';
describe('url scope',()=>{test('apex',()=>expect(apexOf('api.example.com')).toBe('example.com'));test('suffix boundary',()=>{expect(isSubdomainOf('api.example.com','example.com')).toBe(true);expect(isSubdomainOf('example.com.evil.test','example.com')).toBe(false)})})
