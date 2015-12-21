<?
			echo $_SERVER['DOCUMENT_ROOT'];
			$root = $_SERVER['DOCUMENT_ROOT'];
			$src = $root."/demo/dir_test";
			$dest = $root."/dist/dir_testcopy2";
			$cmd = "git clone -l  $src $dest";
			$res = shell_exec($cmd);
			echo' '.$cmd.' result '.$res;
?>