from ortools.sat.python import cp_model
import json
import sys
import time

def run_scheduling(existing_sessions, new_session, constraints=None):
    """
    Schedule a new session using OR-Tools constraint programming
    
    Args:
        existing_sessions: List of existing sessions with their details
        new_session: New session to be scheduled
        constraints: Optional dictionary of constraints
    
    Returns:
        Writes JSON result to stdout
    """
    # Start timer for performance tracking
    start_time = time.time()
    
    model = cp_model.CpModel()
    
    # Get constraints configuration or use defaults
    constraints = constraints or {}
    max_sessions_per_slot = constraints.get('max_sessions_per_slot', 4)
    
    # Define available time slots (configurable)
    time_slots = constraints.get('time_slots', [
        ("09:00:00", "10:00:00"),
        ("10:00:00", "11:00:00"),
        ("11:00:00", "12:00:00"),
        ("12:00:00", "13:00:00"),
        ("13:00:00", "14:00:00"),
        ("14:00:00", "15:00:00"),
        ("15:00:00", "16:00:00"),
        ("16:00:00", "17:00:00"),
    ])
    
    # Define instruments with special constraints
    exclusive_instruments = constraints.get('exclusive_instruments', ["Drums", "Piano"])
    
    # Create variables for available slots
    slot_vars = [model.NewBoolVar(f"slot_{i}") for i in range(len(time_slots))]
    
    # Constraint: Max sessions per slot
    for i, slot in enumerate(time_slots):
        num_sessions = sum(1 for s in existing_sessions if s.get("session_time") == slot[0])
        if num_sessions >= max_sessions_per_slot:
            model.Add(slot_vars[i] == 0)  # Block fully booked slots
    
    # Constraint: Only 1 session per slot for exclusive instruments
    if new_session.get("instrument_id") in exclusive_instruments:
        for i, slot in enumerate(time_slots):
            if any(s.get("instrument_id") == new_session.get("instrument_id") and 
                   s.get("session_time") == slot[0] for s in existing_sessions):
                model.Add(slot_vars[i] == 0)  # Block slots with same instrument
    
    # Constraint: Must assign exactly one slot
    model.Add(sum(slot_vars) == 1)
    
    # Solve the optimization problem
    solver = cp_model.CpSolver()
    status = solver.Solve(model)
    
    # Calculate solution time
    solution_time = time.time() - start_time
    
    if status == cp_model.FEASIBLE or status == cp_model.OPTIMAL:
        for i, slot in enumerate(time_slots):
            if solver.Value(slot_vars[i]) == 1:
                result_session = new_session.copy()
                result_session["session_start"] = slot[0]
                result_session["session_end"] = slot[1]
                result_session["solution_time"] = f"{solution_time:.3f}s"
                sys.stdout.write(json.dumps({
                    "success": True, 
                    "scheduled_session": result_session,
                    "stats": {
                        "solution_time": solution_time,
                        "status": "OPTIMAL" if status == cp_model.OPTIMAL else "FEASIBLE"
                    }
                }) + "\n")
                return
    
    sys.stdout.write(json.dumps({
        "error": "No valid schedule found",
        "stats": {
            "solution_time": solution_time,
            "status": "INFEASIBLE" if status == cp_model.INFEASIBLE else "UNKNOWN"
        }
    }) + "\n")

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read().strip())
        existing_sessions = input_data.get("existing_sessions", [])
        new_session = input_data.get("new_session", {})
        constraints = input_data.get("constraints", {})
        
        run_scheduling(existing_sessions, new_session, constraints)
    except json.JSONDecodeError:
        sys.stdout.write(json.dumps({"error": "Invalid JSON input"}) + "\n")
    except Exception as e:
        sys.stdout.write(json.dumps({"error": f"Unexpected error: {str(e)}"}) + "\n")