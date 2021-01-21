// extracted
module CALCBOUND
    imports MEV
    rule <k>
            %s
         => ?X
     </k>
    <S> ( (Uniswap in 0) |-> 0 (Uniswap in SAI) |-> 0 ) =>?Y0:Map </S>
    <M> .Set => ?Y1:Set </M>
    <B> .List => ?Y2:List </B>
    <P> .Map => ?Y3:Map </P>
    <V> .Map => ?Y4:Map </V>
    ensures ( ({?Y0[0 in SAI]}:>Int <=Int 0) andBool ?X ==K DONE) orBool (?X ==K FAIL)
endmodule
