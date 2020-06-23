export class Book {
    title: string;
    author: string;
    gradeLevel: number;
    interests: [ string ];
    leadershipTraits: [ string ];
    leadershipSkills: [string];
    _links: {
        self: [
            { href: string }
        ]
    };
}
