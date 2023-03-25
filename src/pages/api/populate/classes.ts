// 1st level classes
export class Curriculum {
  constructor(handle: string) {
    this.handle = handle
  }

  handle: string
}

export class Period {
  constructor(handle: string) {
    this.handle = handle
  }

  handle: string
}

export class Course {
  constructor(handle: string, name: string) {
    this.handle = handle
    this.name = name
  }

  handle: string
  name: string
}

export class Student {
  constructor(email: string) {
    this.email = email
  }

  email: string
}

export class Teacher {
  constructor(first_name: string, last_name: string) {
    this.first_name = first_name
    this.last_name = last_name
  }

  first_name: string
  last_name: string
}

// 2nd level classes
export class Level {
  constructor(number: number, curriculum: Curriculum) {
    this.number = number
    this.curriculum = curriculum
  }

  number: number
  curriculum: Curriculum
  elective_count?: number

  setElectiveCount(count: number) {
    this.elective_count = count
  }
}

export class Clase {
  constructor(course: Course, period: Period) {
    this.course = course
    this.period = period
  }

  course: Course
  period: Period
}

export class Student_Curriculum {
  constructor(student: Student, curriculum: Curriculum) {
    this.student = student
    this.curriculum = curriculum
  }

  student: Student
  curriculum: Curriculum
}

// 3rd level classes
export class Level_Course {
  constructor(level: Level, course: Course, credits: number) {
    this.level = level
    this.course = course
    this.credits = credits
  }

  level: Level
  course: Course
  credits: number
}

export class Classroom {
  constructor(section: number, clase: Clase, teacher: Teacher) {
    this.section = section
    this.clase = clase
    this.teacher = teacher
  }

  section: number
  clase: Clase
  teacher: Teacher
  score?: number

  setScore(score: number) {
    this.score = score
  }
}

export class Evaluation {
  constructor(
    handle: string,
    name: string,
    weight: number,
    delete_lowest: boolean,
    clase: Clase
  ) {
    this.handle = handle
    this.name = name
    this.weight = weight
    this.delete_lowest = delete_lowest
    this.clase = clase
  }

  handle: string
  name: string
  weight: number
  delete_lowest: boolean
  clase: Clase
}

// 4th level classes
export class Enrollment {
  constructor(student: Student, classroom: Classroom, final_score: number) {
    this.student = student
    this.classroom = classroom
    this.final_score = final_score
  }

  student: Student
  classroom: Classroom
  final_score: number
}

// 5th level classes
export class Score {
  constructor(
    evaluation: Evaluation,
    enrollment: Enrollment,
    grades: number[]
  ) {
    this.evaluation = evaluation
    this.enrollment = enrollment
    this.grades = grades
  }

  evaluation: Evaluation
  enrollment: Enrollment
  grades: number[]

  addGrade(grade: number) {
    this.grades.push(grade)
  }
}
