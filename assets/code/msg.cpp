#include "out.h"



int _init(EVP_PKEY_CTX *ctx)

{
  int iVar1;

  iVar1 = __gmon_start__();
  return iVar1;
}



void FUN_00100640(void)

{
                    // WARNING: Treating indirect jump as call
  (*(code *)(undefined *)0x0)();
  return;
}



// WARNING: Unknown calling convention -- yet parameter storage is locked

int puts(char *__s)

{
  int iVar1;

  iVar1 = puts(__s);
  return iVar1;
}



// WARNING: Unknown calling convention -- yet parameter storage is locked

size_t strlen(char *__s)

{
  size_t sVar1;

  sVar1 = strlen(__s);
  return sVar1;
}



void __stack_chk_fail(void)

{
                    // WARNING: Subroutine does not return
  __stack_chk_fail();
}



// WARNING: Unknown calling convention -- yet parameter storage is locked

char * fgets(char *__s,int __n,FILE *__stream)

{
  char *pcVar1;

  pcVar1 = fgets(__s,__n,__stream);
  return pcVar1;
}



// WARNING: Unknown calling convention -- yet parameter storage is locked

FILE * popen(char *__command,char *__modes)

{
  FILE *pFVar1;

  pFVar1 = popen(__command,__modes);
  return pFVar1;
}



// WARNING: Unknown calling convention -- yet parameter storage is locked

void exit(int __status)

{
                    // WARNING: Subroutine does not return
  exit(__status);
}



void __cxa_finalize(void)

{
  __cxa_finalize();
  return;
}



void processEntry _start(undefined8 param_1,undefined8 param_2)

{
  undefined auStack_8 [8];

  __libc_start_main(main,param_2,&stack0x00000008,__libc_csu_init,__libc_csu_fini,param_1,auStack_8)
  ;
  do {
                    // WARNING: Do nothing block with infinite loop
  } while( true );
}



// WARNING: Removing unreachable block (ram,0x00100707)
// WARNING: Removing unreachable block (ram,0x00100713)

void deregister_tm_clones(void)

{
  return;
}



// WARNING: Removing unreachable block (ram,0x00100758)
// WARNING: Removing unreachable block (ram,0x00100764)

void register_tm_clones(void)

{
  return;
}



void __do_global_dtors_aux(void)

{
  if (completed_7696 != '\0') {
    return;
  }
  __cxa_finalize(__dso_handle);
  deregister_tm_clones();
  completed_7696 = 1;
  return;
}



void frame_dummy(void)

{
  register_tm_clones();
  return;
}



// WARNING: Unknown calling convention

void print_msg(void)

{
  FILE *__stream;
  char *pcVar1;
  size_t sVar2;
  long in_FS_OFFSET;
  int i;
  int i_1;
  int i_2;
  FILE *fp;
  char output [6];
  char path [1035];
  long local_20;

  local_20 = *(long *)(in_FS_OFFSET + 0x28);
  __stream = popen("uname","r");
  if (__stream == (FILE *)0x0) {
                    // WARNING: Subroutine does not return
    exit(1);
  }
  do {
    pcVar1 = fgets(path,0x40a,__stream);
  } while (pcVar1 != (char *)0x0);
  i = 0;
  while( true ) {
    sVar2 = strlen(MSG);
    if (sVar2 <= (ulong)(long)i) break;
    output[i] = MSG[i] ^ path[i];
    i = i + 1;
  }
  i_1 = 0;
  while( true ) {
    sVar2 = strlen(output);
    if (sVar2 <= (ulong)(long)i_1) break;
    output[i_1] = output[i_1] + ' ';
    i_1 = i_1 + 1;
  }
  i_2 = 0;
  while( true ) {
    sVar2 = strlen(output);
    if (sVar2 <= (ulong)(long)i_2) break;
    output[i_2] = output[i_2] + '\t';
    i_2 = i_2 + 1;
  }
  puts(output);
  if (local_20 != *(long *)(in_FS_OFFSET + 0x28)) {
                    // WARNING: Subroutine does not return
    __stack_chk_fail();
  }
  return;
}



int main(int argc,char **argv)

{
  char **argv_local;
  int argc_local;

  MSG = "fubar";
  print_msg();
                    // WARNING: Subroutine does not return
  exit(0);
}



void __libc_csu_init(EVP_PKEY_CTX *param_1,undefined8 param_2,undefined8 param_3)

{
  long lVar1;

  _init(param_1);
  lVar1 = 0;
  do {
    (*(code *)(&__frame_dummy_init_array_entry)[lVar1])((ulong)param_1 & 0xffffffff,param_2,param_3)
    ;
    lVar1 = lVar1 + 1;
  } while (lVar1 != 1);
  return;
}



void __libc_csu_fini(void)

{
  return;
}



void _fini(void)

{
  return;
}
