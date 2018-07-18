
/*
    Brew.js API - C++ core
    Node API -> Module -> fs
*/

#include <switch.h>
#include "../duktape/duktape.h"
#include <dirent.h>
#include <stdio.h>
#include <string.h>

namespace fs
{
    inline int readFile(duk_context *ctx)
    {
        if(duk_get_top(ctx) >= 1)
        {
            string path = string(duk_get_string(ctx, 0));
            ifstream ifs(path);
            if(ifs.good())
            {
                stringstream strm;
                string read;
                strm << ifs.rdbuf();
                read = strm.str();
                duk_push_string(ctx, read.c_str());
            }
            ifs.close();
        }
        return 1;
    }

    inline int writeFile(duk_context *ctx)
    {
        if(duk_get_top(ctx) >= 2)
        {
            const char *path = duk_get_string(ctx, 0);
            const char *data = duk_get_string(ctx, 1);
            ofstream ofs(path);
            if(ofs.good())
            {
                ofs << data;
            }
            ofs.close();
        }
        return 1;
    }

    inline int exists(duk_context *ctx)
    {
        if(duk_get_top(ctx) >= 1)
        {
            const char *path = duk_get_string(ctx, 0);
            ifstream ifs(path);
            bool ex = ifs.good();
            ifs.close();
            duk_push_boolean(ctx, ex);
        }
        return 1;
    }

    inline int c_mkdir(duk_context *ctx)
    {
        if(duk_get_top(ctx) >= 1)
        {
            const char *dir = duk_get_string(ctx, 0);
            mkdir(dir, 777);
        }
        return 1;
    }
	
	inline int c_readdir(duk_context *ctx)
	{
		if(duk_get_top(ctx) >= 1)
        {
            const char *path = duk_get_string(ctx, 0);
			DIR* dir;
		struct dirent* ent;

		dir = opendir(path);//Open current-working-directory.
		if(dir==NULL)
		{
			
		}
		else
		{
			size_t list_length = 0, list_capacity = 5000;
char *list = (char*) calloc(list_capacity, sizeof(char));
if(list == NULL) {
  closedir(dir);
  return NULL;
}
list[list_length++] = ';';
while((ent = readdir(dir))) {
  while(list_length + strlen(ent->d_name) + 1 > list_capacity) { // ensure room in list
    list_capacity*= 2;
    list = (char*) realloc(list, list_capacity * sizeof(char)); // potential memory leak here on failure
    if(list == NULL) {
		closedir(dir);
		return NULL; }
  }
  strcpy(list + list_length, ent->d_name); // don't copy null terminator
  list_length+= strlen(ent->d_name);
  list[list_length++] = ';';
}
closedir(dir);
duk_push_lstring(ctx, list, list_length);
free(list);
return 1;
		}
        }
		return NULL;
	}

    inline int unlink(duk_context *ctx)
    {
        if(duk_get_top(ctx) >= 1)
        {
            const char *dir = duk_get_string(ctx, 0);
            remove(dir);
        }
        return 1;
    }

    void Context(duk_context *ctx)
    {
        duk_push_c_function(ctx, readFile, DUK_VARARGS);
	    duk_put_global_string(ctx, "__fs__readFile");
        duk_push_c_function(ctx, writeFile, DUK_VARARGS);
	    duk_put_global_string(ctx, "__fs__writeFile");
        duk_push_c_function(ctx, exists, DUK_VARARGS);
	    duk_put_global_string(ctx, "__fs__exists");
        duk_push_c_function(ctx, c_readdir, DUK_VARARGS);
	    duk_put_global_string(ctx, "__fs__readdir");
        duk_push_c_function(ctx, c_mkdir, DUK_VARARGS);
	    duk_put_global_string(ctx, "__fs__mkdir");
        duk_push_c_function(ctx, unlink, DUK_VARARGS);
	    duk_put_global_string(ctx, "__fs__unlink");
    }
}