#################### NOTE #######################
### THIS IS NOT INDENTED TO BE HUMAN-READABLE ###
#################################################
C='repos'
B='directory.json'
import os as A,json,shutil as D
def E(directory):
    J='children';I='folder';F=directory;E='type';D='name';G=[]
    for(K,L,M)in A.walk(F):
        H=A.path.relpath(K,F);N=H.split(A.sep)if H!='.'else[];B=G
        for O in N:
            for C in B:
                if C[D]==O and C[E]==I:B=C.setdefault(J,[]);break
        for P in L:B.append({D:P,E:I,J:[]})
        for Q in M:B.append({D:Q,E:'file'})
    return G
def F(data,output_file):
    A.remove(B)
    with open(output_file,'w')as C:json.dump(data,C,indent=4)
def G(foldername):A=foldername;B=A.replace('/','')+'.zip';D.make_archive(B,'zip',A)
def H():
    A.chdir(C);E=[];B=A.listdir()
    for D in range(len(B)):
        if A.path.isdir(B[D]):G(B[D])
if __name__=='__main__':H();I=C;J=E(I);F(J,B)