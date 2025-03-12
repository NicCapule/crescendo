from ortools.linear_solver import pywraplp
import json
import sys

def run_scheduling(existing_sessions, new_session):
    solver = pywraplp.Solver.CreateSolver('CBC')

    # Decision variable: Assign new session to a valid slot
    x = solver.BoolVar('session')

    # Constraint: Ensure max 4 sessions per slot
    session_count = len(existing_sessions) + 1
    if session_count > 4:
        print(json.dumps({"error": "Time slot already full"}))
        return

    # Constraint: Only 1 drum session per time slot
    if new_session["instrument_id"] == "Drums":
        for session in existing_sessions:
            if session["instrument_id"] == "Drums":
                print(json.dumps({"error": "Only 1 drum session allowed per time slot"}))
                return

    # Solve
    status = solver.Solve()

    if status == pywraplp.Solver.OPTIMAL:
        print(json.dumps({"success": True, "scheduled_session": new_session}))
    else:
        print(json.dumps({"error": "No valid schedule found"}))

if __name__ == "__main__":
    # Read input JSON from Node.js
    input_data = json.loads(sys.stdin.read())
    existing_sessions = input_data["existing_sessions"]
    new_session = input_data["new_session"]

    run_scheduling(existing_sessions, new_session)
