import { describe, beforeEach, it, expect, vi } from 'vitest'
import { Group } from '../mail/group.js';

describe('Group', () => {
  let group: Group;

  beforeEach(() => {
    group = new Group();
    vi.restoreAllMocks(); // vegiterian eats after cleaning the dish that is used by non-vegiterian
  });

  it('testing-1: testing add group', () => {
    group.addGroup('devs', ['dev1@gmail.com', 'dev2@gmail.com']);

    expect(group.getGroup('devs')).toEqual(['dev1@gmail.com', 'dev2@gmail.com']);
    expect(group.getGroup("cn")).toBeUndefined();
  });

  it('testing-2: add bulk group', () => {
    let bulkGroup = new Map<string, string[]>();

    bulkGroup.set("devs", ['dev1@gmail.com', 'dev2@gmail.com']);
    bulkGroup.set("cn", ['l1@gmail.com', 'l2@gmail.com']);

    group.addBulkGroups(bulkGroup);
    expect(group.getGroup("cn")).toEqual(['l1@gmail.com', 'l2@gmail.com']);
    expect(group.getGroup("db")).toBeUndefined();
  });

  it('testing-3: removed group', () => {
    group.addGroup('devs', ['dev1@gmail.com', 'dev2@gmail.com']);

    const isRemoved = group.removeGroup('devs');

    expect(isRemoved).toBe(true); 
    expect(group.getGroup('devs')).toBeUndefined(); 
  });

  it('testing-4: list groups', () => {
    let bulkGroup = new Map<string, string[]>();

    bulkGroup.set("devs", ['dev1@gmail.com', 'dev2@gmail.com']);
    bulkGroup.set("cn", ['l1@gmail.com', 'l2@gmail.com']);

    group.addBulkGroups(bulkGroup);

    expect(group.listGroups()).toEqual(['devs', 'cn']);
  });

  it('testing-5: get all groups', () => {
    let bulkGroup = new Map<string, string[]>();

    bulkGroup.set("devs", ['dev1@gmail.com', 'dev2@gmail.com']);
    bulkGroup.set("cn", ['l1@gmail.com', 'l2@gmail.com']);

    group.addBulkGroups(bulkGroup);

    expect(group.getAll()).toEqual(bulkGroup);
  });

  it('testing-6: testing add member', () => {
    group.addGroup('devs', ['dev1@gmail.com']);

    expect(group.getGroup('devs')).toEqual(['dev1@gmail.com']);

    group.addGroupMember('devs', 'dev2@gmail.com');
    expect(group.getGroup('devs')).toEqual(['dev1@gmail.com', 'dev2@gmail.com']);
  });

  it('testing-7: testing remove member', () => {
    group.addGroup('devs', ['dev1@gmail.com', 'dev2@gmail.com']);

    const result = group.removeGroupMember('devs', 'dev2@gmail.com');
    
    expect(result).toBe(true);
    expect(group.getGroup('devs')).toEqual(['dev1@gmail.com']);
  });

  it('testing-8: handling non-existent groups', () => {
    const removeResult = group.removeGroup('ghost_group');
    expect(removeResult).toBe(false);
    
    expect(group.getGroup('ghost_group')).toBeUndefined();
  });

  it('testing-9: fail to add member to missing group', () => {
    //⬇️ Used to silent the console error ( spyOn:- spy & mockimp..:- what to do when got error )
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    group.addGroupMember('unknown_group', 'user@gmail.com');

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("No Group Found"));
    
    expect(group.getGroup('unknown_group')).toBeUndefined();
  });

  it('testing-10: fail to remove member from missing group', () => {
    const result = group.removeGroupMember('unknown_group', 'user@gmail.com');
    
    expect(result).toBe(false);
  });

  it('testing-11: remove member who is not in the group', () => {
    group.addGroup('devs', ['dev1@gmail.com']);

    const result = group.removeGroupMember('devs', 'imposter@gmail.com');

    expect(result).toBe(true)
    expect(group.getGroup('devs')).toEqual(['dev1@gmail.com']);
  });

});