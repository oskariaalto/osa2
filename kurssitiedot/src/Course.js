const Course = ({course}) => (
    <div>
     <Header course={course} />
     <Content parts={course.parts}/>
     <Totals parts={course.parts}/> 
    </div>
  )
  
  const Header = ({course}) => (
    <h2>{course.name}</h2>
  )
  
  const Content = ({parts}) =>{
    return(
      <div>
        {parts.map(part =>
          <Part key={part.id} part={part}/>)}
      </div>
    )
  }
  
  const Part = ({part}) => {
    return(
      <p>{part.name} {part.exercises}</p>
    )
  }
  
  const Totals = ({parts}) => {
    const total = parts.reduce(
      (s,p) => s+p.exercises,0
    )
    console.log(total)
    return(
      <h4>total of {total} exercises</h4>
    )
  }

  export default Course