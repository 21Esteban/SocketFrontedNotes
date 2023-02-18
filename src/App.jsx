import { useEffect, useState } from "react";

import { useSocket } from "./hooks/useSocket";

const initialState =  {
  title:"",
  description:"",
}


function App() {
  const { socket } = useSocket("http://localhost:4000");

  useEffect(() => {
    // Llamada a la función getNotes solo una vez en la inicialización del componente
    getNotes();
  }, []);

  const [note, setNote] = useState(initialState);
  const [notes, setNotes] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const getNotes = () => {
    socket.on("server:getNotes", (notes) => {
      setNotes(notes);
    });
  };


  const actions = (e)=>{
    e.preventDefault()
     // Verificar si se está editando o agregando una nueva nota
     isEdit ? socket.emit("client:updateNote", note) : socket.emit("client:addNote", note);
     setNote(initialState);
     setIsEdit(false);
  }

  const edit = (note) => {
    setIsEdit(true)
    setNote(note)

  }

  const deleteNote = (id) => {
    socket.emit("client:deleteNote",id)
  }



  return (
    <div className="App">
      <form onSubmit={actions}><div
        className="card text-white bg-primary"
        style={{ maxWidth: "25rem", marginLeft: "25px" }}
      >
        <div className="card-header d-flex justify-content-center">
          <h2>Notes</h2>
        </div>
        <div className="card-body">
          {/* <h4 className="card-title">Primary card title</h4> */}
          <label className="form-label mt-4" htmlFor="readOnlyInput">
            Title
          </label>
          <input
            className="form-control"
            name="title"
            type="text"
            placeholder="Title"
            autoFocus
            required
            value={note.title}
            onChange={(e) => handleChange(e)}
          ></input>

          <label className="form-label mt-4" htmlFor="readOnlyInput">
            Description
          </label>
          <input
            className="form-control"
            name="description"
            type="text"
            placeholder="Description"
            required
            value={note.description}
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        <div className="card-footer d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-outline-success"
            style={{ width: "80px" }}
          >
            {isEdit ? "Edit" : "Save"}
          </button>
        </div>
      </div></form>
      

      {/* Notes */}

      <ul className="list-group mt-3">
        {notes.map((note, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center">
            <span className="badge bg-primary rounded-pill" style={{marginRight:"10px"}}>{index+1}</span>
              <span>{note.title}</span>
              
            </div>
            <h6>{note.description}</h6>
            <div className="d-flex">
              <button type="button" className="btn btn-danger" onClick={()=>deleteNote(note._id)}>
                Delete
              </button>
              <button type="button" className="btn btn-info " onClick={()=>edit(note)}>Update</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
