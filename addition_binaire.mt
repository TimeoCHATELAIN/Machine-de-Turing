/**  States **/
q0
q'0
q1
q'1
q2
q3
q'3
q4
q5
q'5

/**  Input symbols **/
0
1
x

/**  Tape alphabet **/
0
1
x
A
B
C

/**  Blank symbol **/
#

/**  Initial state **/
q0

/**  Final states **/
q5

/**  Transitions **/
q0,0->q1,A,R
q0,1->q1,B,R

q'0,0->q1,B,R
q'0,1->q1,C,R

q1,0->q1,0,R
q1,1->q1,1,R
q1,x->q2,0,R
q1,#->q4,#,L

q2,0->q3,x,L
q2,1->q'3,x,L
q2,#->q3,#,L

q3,0->q3,0,L
q3,1->q3,1,L
q3,A->q0,0,R
q3,B->q0,1,R
q3,C->q'0,0,R

q'3,0->q'3,0,L
q'3,1->q'3,1,L
q'3,A->q0,1,R
q'3,B->q'0,0,R
q'3,C->q'0,1,R

q4,0->q4,0,L
q4,1->q4,1,L
q4,A->q5,0,R
q4,B->q5,1,R
q4,C->q'5,0,R

q'5,0->q5,1,R
q'5,1->q'5,0,R