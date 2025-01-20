/**  States **/
q0
q1
q2
q3
q4

/**  Input symbols **/
a
b

/**  Tape alphabet **/
a
b
A
B
#

/**  Blank symbol **/
#

/**  Initial state **/
q0

/**  Final states **/
q4

/**  Transitions **/
q0,a->q1,A,R
q0,B->q3,B,R
q1,a->q1,a,R
q1,b->q2,B,L
q1,B->q1,B,R
q2,a->q2,a,L
q2,A->q0,A,R
q2,B->q2,B,L
q3,B->q3,B,R
q3,#->q4,#,R
