
export class Group{
    groups : Map<string, string[]>
    constructor(){
        this.groups = new Map<string, string[]>() // () => Makes it compile
    }

    addGroup(key : string, value : string[]){
        this.groups.set(key, value)
    }

    getGroup(key : string) : string[] | undefined {
        return this.groups.get(key)
    }

    addBulkGroups(map : Map<string, string[]>){
        map.forEach((value, key) =>{
            this.groups.set(key, value)
        })
    }

    removeGroup(key : string) : boolean{
        return this.groups.delete(key);
    }
    
    listGroups(): string[] {
      return Array.from(this.groups.keys());
    }

    getAll(): Map<string, string[]> {
      return this.groups;
    }

    addGroupMember(key : string, person : string){
        let group : string[] | undefined = this.getGroup(key);
        if(!group){
            console.log("No Group Found with Name " + key);
            return;
        }
        group.push(person)
        this.groups.set(key, group);
    }

    removeGroupMember(key: string, person: string): boolean {
      const group = this.getGroup(key);
      if (!group) return false;
      const updated = group.filter(p => p !== person);
      this.groups.set(key, updated);
      return true;
    }

}
