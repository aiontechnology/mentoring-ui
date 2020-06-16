export class Book {
    title: string;
    author: string;
    gradeLevel: number;
    interests: [ string ];
    characterTraits: [ string ];
    successSkills: [string];
    _links: {
        self: [
            { href: string }
        ]
    };
}
