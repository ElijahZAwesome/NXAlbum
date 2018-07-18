// Brew.js includes libnx plus some C and C++ basic libs. we don't need anything else
#include "Brew.js/Brew.js.h"

int main()
{
    // JS Libs located at RomFS
    Brew::Init("romfs:/BrewLibs");
    Brew::EvaluateFile("romfs:/Album/main.js");
    Brew::Exit();
	return 0;
}